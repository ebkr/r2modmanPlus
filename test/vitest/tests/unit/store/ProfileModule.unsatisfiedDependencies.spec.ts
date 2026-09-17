import { describe, expect, test } from 'vitest';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import ProfileModule, { UnsatisfiedDependencies } from '../../../../../src/store/modules/ProfileModule';

function createMod(name: string, options: {enabled?: boolean, dependencies?: string[]} = {}): ManifestV2 {
    const mod = new ManifestV2();
    mod.setName(name);
    mod.setDependencies(options.dependencies ?? []);
    if (options.enabled === false) {
        mod.disable();
    }
    return mod;
}

function getUnsatisfiedDependencies(modList: ManifestV2[]): ReadonlyMap<string, UnsatisfiedDependencies> {
    const getter = (ProfileModule.getters as any).unsatisfiedDependencies;
    return getter({modList});
}

describe('ProfileModule.getters.unsatisfiedDependencies', () => {
    test('Returns an empty map for an empty mod list', () => {
        expect(getUnsatisfiedDependencies([]).size).toBe(0);
    });

    test('Mods without dependencies have no entries', () => {
        const mods = [createMod('TeamA-Mod1'), createMod('TeamA-Mod2')];
        expect(getUnsatisfiedDependencies(mods).size).toBe(0);
    });

    test('Mods whose dependencies are installed and enabled have no entries', () => {
        const mods = [
            createMod('TeamA-Mod1', {dependencies: ['TeamA-Mod2-1.0.0', 'TeamB-Mod1-2.1.0']}),
            createMod('TeamA-Mod2'),
            createMod('TeamB-Mod1'),
        ];
        expect(getUnsatisfiedDependencies(mods).size).toBe(0);
    });

    test('Uninstalled dependencies are reported as missing with the full dependency string', () => {
        const mods = [
            createMod('TeamA-Mod1', {dependencies: ['TeamB-Gone-1.0.0']}),
        ];

        const actual = getUnsatisfiedDependencies(mods);

        expect(actual.size).toBe(1);
        expect(actual.get('TeamA-Mod1')).toStrictEqual({
            disabledDependencies: [],
            missingDependencies: ['TeamB-Gone-1.0.0'],
        });
    });

    test('Disabled dependencies are reported with the installed mod instance', () => {
        const disabledDependency = createMod('TeamB-Library', {enabled: false});
        const mods = [
            createMod('TeamA-Mod1', {dependencies: ['TeamB-Library-1.0.0']}),
            disabledDependency,
        ];

        const actual = getUnsatisfiedDependencies(mods);

        expect(actual.size).toBe(1);
        expect(actual.get('TeamA-Mod1')!.missingDependencies).toStrictEqual([]);
        expect(actual.get('TeamA-Mod1')!.disabledDependencies).toHaveLength(1);
        expect(actual.get('TeamA-Mod1')!.disabledDependencies[0]).toBe(disabledDependency);
    });

    test('Missing and disabled dependencies are reported together for the same mod', () => {
        const disabledDependency = createMod('TeamB-Library', {enabled: false});
        const mods = [
            createMod('TeamA-Mod1', {dependencies: ['TeamB-Library-1.0.0', 'TeamC-Gone-1.0.0']}),
            disabledDependency,
        ];

        const actual = getUnsatisfiedDependencies(mods);

        expect(actual.get('TeamA-Mod1')).toStrictEqual({
            disabledDependencies: [disabledDependency],
            missingDependencies: ['TeamC-Gone-1.0.0'],
        });
    });

    test('Only mods with unsatisfied dependencies get entries', () => {
        const mods = [
            createMod('TeamA-Healthy', {dependencies: ['TeamB-Mod1-1.0.0']}),
            createMod('TeamB-Mod1'),
            createMod('TeamC-Broken', {dependencies: ['TeamD-Gone-1.0.0']}),
        ];

        const actual = getUnsatisfiedDependencies(mods);

        expect(actual.size).toBe(1);
        expect(actual.has('TeamA-Healthy')).toBe(false);
        expect(actual.has('TeamC-Broken')).toBe(true);
    });

    test('Dependency version suffix is stripped when matching legacy team names with hyphens', () => {
        const mods = [
            createMod('TeamA-Mod1', {dependencies: ['Team-With-Hyphens-Lib-1.0.0']}),
            createMod('Team-With-Hyphens-Lib'),
        ];

        expect(getUnsatisfiedDependencies(mods).size).toBe(0);
    });

    test('Disabled mods have their own dependencies evaluated too', () => {
        const mods = [
            createMod('TeamA-Disabled', {enabled: false, dependencies: ['TeamB-Gone-1.0.0']}),
        ];

        const actual = getUnsatisfiedDependencies(mods);

        expect(actual.get('TeamA-Disabled')).toStrictEqual({
            disabledDependencies: [],
            missingDependencies: ['TeamB-Gone-1.0.0'],
        });
    });
});
