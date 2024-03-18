import ThunderstoreMod from "../../../../src/model/ThunderstoreMod";
import ThunderstoreVersion from "../../../../src/model/ThunderstoreVersion";
import ThunderstorePackages from "../../../../src/r2mm/data/ThunderstorePackages";

describe("ThunderstorePackages.getDeprecatedPackageMap", () => {
    let spyedPopulator: jest.SpyInstance;

    beforeEach(() => {
        spyedPopulator = jest.spyOn(ThunderstorePackages, '_populateDeprecatedPackageMapForModChain');
    });

    afterEach(() => {
        jest.restoreAllMocks();  // restore the spy created with spyOn
    });

    it("Handles simple undeprecated chain", () => {
        const mods =[
            createStubMod('TeamA-Mod1', false, ['TeamA-Mod2', 'TeamB-Mod1']),
            createStubMod('TeamA-Mod2'),
            createStubMod('TeamB-Mod1', false, ['TeamC-Mod1']),
            createStubMod('TeamC-Mod1')
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        expect(actual.size).toBe(4);
        expect(actual.get('TeamA-Mod1')).toStrictEqual(false);
        expect(actual.get('TeamA-Mod2')).toStrictEqual(false);
        expect(actual.get('TeamB-Mod1')).toStrictEqual(false);
        expect(actual.get('TeamC-Mod1')).toStrictEqual(false);
    });

    it("Handles simple chain with deprecation", () => {
        const mods =[
            createStubMod('TeamA-Mod1', false, ['TeamA-Mod2', 'TeamB-Mod1']),
            createStubMod('TeamA-Mod2'),
            createStubMod('TeamB-Mod1', true, ['TeamC-Mod1']),
            createStubMod('TeamC-Mod1')
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        expect(actual.size).toBe(4);
        expect(actual.get('TeamA-Mod1')).toStrictEqual(true);
        expect(actual.get('TeamA-Mod2')).toStrictEqual(false);
        expect(actual.get('TeamB-Mod1')).toStrictEqual(true);
        expect(actual.get('TeamC-Mod1')).toStrictEqual(false);
    });

    it("Doesn't infinite-loop on direct dependency loop", () => {
        const mods =[
            createStubMod('Degrec-Alfie_Knee', false, ['Degrec-Alfie_Other_Knee']),
            createStubMod('Degrec-Alfie_Other_Knee', false, ['Degrec-Alfie_Knee']),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        expect(actual.size).toBe(2);
        expect(actual.get('Degrec-Alfie_Knee')).toStrictEqual(false);
        expect(actual.get('Degrec-Alfie_Other_Knee')).toStrictEqual(false);
    });

    it("Doesn't infinite-loop on three-way dependency loop", () => {
        const mods =[
            createStubMod('Loop1-Mod1', false, ['Loop1-Mod2']),
            createStubMod('Loop1-Mod2', false, ['Loop1-Mod3']),
            createStubMod('Loop1-Mod3', false, ['Loop1-Mod1']),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        expect(actual.size).toBe(3);
        expect(actual.get('Loop1-Mod1')).toStrictEqual(false);
        expect(actual.get('Loop1-Mod2')).toStrictEqual(false);
        expect(actual.get('Loop1-Mod3')).toStrictEqual(false);
    });

    it("Marks all mods deprecated on dependency loop", () => {
        const mods =[
            createStubMod('Loop2-Mod1', false, ['Loop2-Mod4']),
            createStubMod('Loop2-Mod2', false, ['Loop2-Mod3']),
            createStubMod('Loop2-Mod3', true, ['Loop2-Mod1']),
            createStubMod('Loop2-Mod4', false, ['Loop2-Mod2']),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        expect(actual.size).toBe(4);
        expect(actual.get('Loop2-Mod1')).toStrictEqual(true);
        expect(actual.get('Loop2-Mod2')).toStrictEqual(true);
        expect(actual.get('Loop2-Mod3')).toStrictEqual(true);
        expect(actual.get('Loop2-Mod4')).toStrictEqual(true);
    });

    it("Doesn't recheck already processed chains (top-down)", () => {
        const mods =[
            createStubMod('X-Root1', false, ['X-ChainTop']),
            createStubMod('X-Root2', false, ['X-ChainTop']),
            createStubMod('X-Root3', false, ['X-ChainTop']),
            createStubMod('X-ChainTop', false, ['X-ChainMiddle']),
            createStubMod('X-ChainMiddle', false, ['X-ChainBottom']),
            createStubMod('X-ChainBottom'),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        // Each mod causes one call due to for-loop (6 calls).
        // Root1 causes three recursive calls down the chain (total 9 calls).
        // Root2 and Root3 should each recursively call X-ChainTop, but
        // no further down the chain (total 11 calls).
        expect(spyedPopulator).toBeCalledTimes(11);
        expect(actual.size).toBe(6);
        expect(actual.get('X-Root1')).toStrictEqual(false);
        expect(actual.get('X-Root2')).toStrictEqual(false);
        expect(actual.get('X-Root3')).toStrictEqual(false);
        expect(actual.get('X-ChainTop')).toStrictEqual(false);
        expect(actual.get('X-ChainMiddle')).toStrictEqual(false);
        expect(actual.get('X-ChainBottom')).toStrictEqual(false);
        jest.restoreAllMocks();  // restore the spy created with spyOn
    });

    it("Doesn't recheck already processed chains (bottom-up)", () => {
        const mods =[
            createStubMod('X-ChainBottom'),
            createStubMod('X-ChainMiddle', false, ['X-ChainBottom']),
            createStubMod('X-ChainTop', false, ['X-ChainMiddle']),
            createStubMod('X-Root1', false, ['X-ChainTop']),
            createStubMod('X-Root2', false, ['X-ChainTop']),
            createStubMod('X-Root3', false, ['X-ChainTop']),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        // Each mod causes one call due to for-loop (6 calls).
        // Excluding ChainBottom, each mod should recursively call their
        // first dependency, but no further down the chain (total 11 calls).
        expect(spyedPopulator).toBeCalledTimes(11);
        expect(actual.size).toBe(6);
        expect(actual.get('X-Root1')).toStrictEqual(false);
        expect(actual.get('X-Root2')).toStrictEqual(false);
        expect(actual.get('X-Root3')).toStrictEqual(false);
        expect(actual.get('X-ChainTop')).toStrictEqual(false);
        expect(actual.get('X-ChainMiddle')).toStrictEqual(false);
        expect(actual.get('X-ChainBottom')).toStrictEqual(false);
    });

    it("Doesn't recheck already processed chains of deprecated mods (top-down)", () => {
        const mods =[
            createStubMod('X-Root1', false, ['X-ChainTop']),
            createStubMod('X-Root2', false, ['X-ChainTop']),
            createStubMod('X-Root3', false, ['X-ChainTop']),
            createStubMod('X-ChainTop', true, ['X-ChainMiddle']),
            createStubMod('X-ChainMiddle', false, ['X-ChainBottom']),
            createStubMod('X-ChainBottom'),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        // Each mod causes one call due to for-loop (6 calls).
        // Each root mod recursively calls X-ChainTop, but the chain is
        // not processed further since it's deprecated (total 9 calls).
        // X-ChainMiddle recursively calls X-ChainBottom (total 10 calls).
        expect(spyedPopulator).toBeCalledTimes(10);
        expect(actual.size).toBe(6);
        expect(actual.get('X-Root1')).toStrictEqual(true);
        expect(actual.get('X-Root2')).toStrictEqual(true);
        expect(actual.get('X-Root3')).toStrictEqual(true);
        expect(actual.get('X-ChainTop')).toStrictEqual(true);
        expect(actual.get('X-ChainMiddle')).toStrictEqual(false);
        expect(actual.get('X-ChainBottom')).toStrictEqual(false);
    });

    it("Doesn't recheck already processed chains of deprecated mods (bottom-up)", () => {
        const mods =[
            createStubMod('X-ChainBottom'),
            createStubMod('X-ChainMiddle', false, ['X-ChainBottom']),
            createStubMod('X-ChainTop', true, ['X-ChainMiddle']),
            createStubMod('X-Root1', false, ['X-ChainTop']),
            createStubMod('X-Root2', false, ['X-ChainTop']),
            createStubMod('X-Root3', false, ['X-ChainTop']),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        // Each mod causes one call due to for-loop (6 calls).
        // Each mod recursively calls it's direct dependency, except for
        // X-ChainBottom (no dependencies) and X-ChainTop (because it's
        // deprecated itself) (total 10 calls).
        expect(spyedPopulator).toBeCalledTimes(10);
        expect(actual.size).toBe(6);
        expect(actual.get('X-Root1')).toStrictEqual(true);
        expect(actual.get('X-Root2')).toStrictEqual(true);
        expect(actual.get('X-Root3')).toStrictEqual(true);
        expect(actual.get('X-ChainTop')).toStrictEqual(true);
        expect(actual.get('X-ChainMiddle')).toStrictEqual(false);
        expect(actual.get('X-ChainBottom')).toStrictEqual(false);
    });

    it("Ingores unknown dependencies", () => {
        const mods =[
            createStubMod('Known-Mod1', false, ['Unknown-Mod1', 'Known-Mod2', 'Unknown-Mod2']),
            createStubMod('Known-Mod2'),
        ];

        const actual = ThunderstorePackages.getDeprecatedPackageMap(mods);

        // Both known mods cause one call due to for-loop (2 calls).
        // Known-Mod1 causes 1 recursive call (total 3 calls).
        // Unknown mods are ignored and don't cause calls
        expect(spyedPopulator).toBeCalledTimes(3);
        expect(actual.size).toBe(2);
        expect(actual.get('Known-Mod1')).toStrictEqual(false);
        expect(actual.get('Known-Mod2')).toStrictEqual(false);
    });
});

const createStubMod = (
    modName: string,
    deprecated: boolean = false,
    dependencyNames: string[] = []
): ThunderstoreMod => {
    const mod = new ThunderstoreMod();
    mod.setFullName(modName);
    mod.setDeprecatedStatus(deprecated);

    const version = new ThunderstoreVersion();
    version.setFullName(`${mod}-1.0.0`);
    version.setDependencies(dependencyNames.map((depName) => `${depName}-1.0.0`));
    mod.setVersions([version]);

    return mod;
}
