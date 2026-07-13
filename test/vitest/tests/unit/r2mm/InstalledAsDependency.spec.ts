import { describe, expect, test } from 'vitest';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import ExportMod from '../../../../../src/model/exports/ExportMod';
import VersionNumber from '../../../../../src/model/VersionNumber';

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
