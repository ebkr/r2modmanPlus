import { describe, expect, test } from 'vitest';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import ExportMod from '../../../../../src/model/exports/ExportMod';
import VersionNumber from '../../../../../src/model/VersionNumber';
import { resolveInstalledAsDependency } from '../../../../../src/utils/ProfileUtils';

function existingMod(installedAsDependency: boolean): ManifestV2 {
    const mod = new ManifestV2();
    mod.setInstalledAsDependency(installedAsDependency);
    return mod;
}

describe('ManifestV2 installedAsDependency', () => {
    test('Defaults to false', () => {
        expect(new ManifestV2().isInstalledAsDependency()).toBe(false);
    });

    test('Getter reflects the setter', () => {
        const mod = new ManifestV2();
        mod.setInstalledAsDependency(true);
        expect(mod.isInstalledAsDependency()).toBe(true);
    });
});

describe('ExportMod installedAsDependency', () => {
    test('fromManifest carries the flag', () => {
        const mod = new ManifestV2();
        mod.setName('Team-Dep');
        mod.setVersionNumber(new VersionNumber('1.0.0'));
        mod.setInstalledAsDependency(true);

        expect(ExportMod.fromManifest(mod).isInstalledAsDependency()).toBe(true);
    });

    test('Defaults to false when omitted from constructor', () => {
        const exportMod = new ExportMod('Team-Root', new VersionNumber('1.0.0'), true);
        expect(exportMod.isInstalledAsDependency()).toBe(false);
    });
});

describe('resolveInstalledAsDependency', () => {
    test('Preserves an existing root when reinstalled as a dependency', () => {
        // Team-Root already installed as a root; now pulled in as someone's
        // dependency (not in explicitRoots). It must stay a root.
        const result = resolveInstalledAsDependency(
            'Team-Root',
            existingMod(false),
            new Set(['Team-Other'])
        );
        expect(result).toBe(false);
    });

    test('Preserves an existing dependency across a version change', () => {
        // Team-Dep already a dependency; a version bump reinstalls it. Even with
        // no explicitRoots (e.g. "update all"), it must not be promoted to a root.
        const result = resolveInstalledAsDependency('Team-Dep', existingMod(true), undefined);
        expect(result).toBe(true);
    });

    test('New mod in explicitRoots is a root', () => {
        const result = resolveInstalledAsDependency(
            'Team-New',
            undefined,
            new Set(['Team-New'])
        );
        expect(result).toBe(false);
    });

    test('New mod absent from explicitRoots is a dependency', () => {
        const result = resolveInstalledAsDependency(
            'Team-New',
            undefined,
            new Set(['Team-Other'])
        );
        expect(result).toBe(true);
    });

    test('New mod with no explicitRoots defaults to dependency', () => {
        // Callers that can't distinguish roots (e.g. "update all") omit
        // explicitRoots; unknown new mods are treated as dependencies.
        expect(resolveInstalledAsDependency('Team-New', undefined, undefined)).toBe(true);
    });
});
