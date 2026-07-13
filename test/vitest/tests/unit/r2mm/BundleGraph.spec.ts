import { describe, expect, test } from 'vitest';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import BundleGraph from '../../../../../src/r2mm/mods/BundleGraph';

function createMod(
    name: string,
    options: {enabled?: boolean, dependencies?: string[], installedAsDependency?: boolean} = {}
): ManifestV2 {
    const mod = new ManifestV2();
    mod.setName(name);
    mod.setDependencies(options.dependencies ?? []);
    mod.setInstalledAsDependency(options.installedAsDependency ?? false);
    if (options.enabled === false) {
        mod.disable();
    }
    return mod;
}

const names = (mods: ManifestV2[]) => mods.map((m) => m.getName()).sort();

describe('BundleGraph.getRoots', () => {
    test('Returns only mods not installed as a dependency', () => {
        const root = createMod('Team-Root');
        const dep = createMod('Team-Dep', {installedAsDependency: true});

        expect(names(BundleGraph.getRoots([root, dep]))).toStrictEqual(['Team-Root']);
    });
});

describe('BundleGraph.getBundleMembers', () => {
    test('Includes the root and its transitive dependency closure', () => {
        const root = createMod('Team-Root', {dependencies: ['Team-Mid-1.0.0']});
        const mid = createMod('Team-Mid', {dependencies: ['Team-Leaf-1.0.0'], installedAsDependency: true});
        const leaf = createMod('Team-Leaf', {installedAsDependency: true});

        expect(names(BundleGraph.getBundleMembers(root, [root, mid, leaf])))
            .toStrictEqual(['Team-Leaf', 'Team-Mid', 'Team-Root']);
    });

    test('Terminates on dependency cycles', () => {
        const a = createMod('Team-A', {dependencies: ['Team-B-1.0.0']});
        const b = createMod('Team-B', {dependencies: ['Team-A-1.0.0'], installedAsDependency: true});

        expect(names(BundleGraph.getBundleMembers(a, [a, b])))
            .toStrictEqual(['Team-A', 'Team-B']);
    });
});

describe('BundleGraph.computeDisableSet', () => {
    test('Disables the root and dependencies exclusive to it', () => {
        const root = createMod('Team-Root', {dependencies: ['Team-Lib-1.0.0']});
        const lib = createMod('Team-Lib', {installedAsDependency: true});

        expect(names(BundleGraph.computeDisableSet(root, [root, lib])))
            .toStrictEqual(['Team-Lib', 'Team-Root']);
    });

    test('Keeps a shared dependency alive when another enabled root needs it', () => {
        const packX = createMod('Team-PackX', {dependencies: ['Team-Shared-1.0.0']});
        const modC = createMod('Team-ModC', {dependencies: ['Team-Shared-1.0.0']});
        const shared = createMod('Team-Shared', {installedAsDependency: true});
        const modList = [packX, modC, shared];

        // Disabling PackX must not disable Shared (ModC still enabled needs it).
        expect(names(BundleGraph.computeDisableSet(packX, modList)))
            .toStrictEqual(['Team-PackX']);
    });

    test('Disables a shared dependency when every other owning root is already disabled', () => {
        const packX = createMod('Team-PackX', {dependencies: ['Team-Shared-1.0.0']});
        const modC = createMod('Team-ModC', {dependencies: ['Team-Shared-1.0.0'], enabled: false});
        const shared = createMod('Team-Shared', {installedAsDependency: true});
        const modList = [packX, modC, shared];

        expect(names(BundleGraph.computeDisableSet(packX, modList)))
            .toStrictEqual(['Team-PackX', 'Team-Shared']);
    });

    test('Does not disable a dependency that is itself an explicitly installed root', () => {
        // User installed Team-Lib explicitly (root) and later a mod that needs it.
        const root = createMod('Team-Root', {dependencies: ['Team-Lib-1.0.0']});
        const lib = createMod('Team-Lib', {installedAsDependency: false});
        const modList = [root, lib];

        expect(names(BundleGraph.computeDisableSet(root, modList)))
            .toStrictEqual(['Team-Root']);
    });

    test('Handles nested bundles (modpack depending on a mod with its own deps)', () => {
        const pack = createMod('Team-Pack', {dependencies: ['Team-Mod-1.0.0']});
        const mod = createMod('Team-Mod', {dependencies: ['Team-Lib-1.0.0'], installedAsDependency: true});
        const lib = createMod('Team-Lib', {installedAsDependency: true});
        const modList = [pack, mod, lib];

        expect(names(BundleGraph.computeDisableSet(pack, modList)))
            .toStrictEqual(['Team-Lib', 'Team-Mod', 'Team-Pack']);
    });
});

describe('BundleGraph.computeEnableSet', () => {
    test('Enables the root and its full dependency closure', () => {
        const root = createMod('Team-Root', {dependencies: ['Team-Mid-1.0.0'], enabled: false});
        const mid = createMod('Team-Mid', {dependencies: ['Team-Leaf-1.0.0'], installedAsDependency: true, enabled: false});
        const leaf = createMod('Team-Leaf', {installedAsDependency: true, enabled: false});

        expect(names(BundleGraph.computeEnableSet(root, [root, mid, leaf])))
            .toStrictEqual(['Team-Leaf', 'Team-Mid', 'Team-Root']);
    });
});

describe('BundleGraph.getEnabledOwners', () => {
    test('Lists enabled roots whose bundle contains the mod', () => {
        const packX = createMod('Team-PackX', {dependencies: ['Team-Shared-1.0.0']});
        const modC = createMod('Team-ModC', {dependencies: ['Team-Shared-1.0.0']});
        const disabledD = createMod('Team-ModD', {dependencies: ['Team-Shared-1.0.0'], enabled: false});
        const shared = createMod('Team-Shared', {installedAsDependency: true});
        const modList = [packX, modC, disabledD, shared];

        expect(names(BundleGraph.getEnabledOwners(shared, modList)))
            .toStrictEqual(['Team-ModC', 'Team-PackX']);
    });
});
