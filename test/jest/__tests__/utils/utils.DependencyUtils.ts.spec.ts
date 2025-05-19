import Dexie from 'dexie';
import { expect, jest, it } from '@jest/globals';

import Game from "../../../../src/model/game/Game";
import { GameInstanceType } from '../../../../src/model/game/GameInstanceType';
import { GameSelectionDisplayMode } from '../../../../src/model/game/GameSelectionDisplayMode';
import ManifestV2 from '../../../../src/model/ManifestV2';
import { PackageLoader } from '../../../../src/model/installing/PackageLoader';
import ThunderstoreCombo from '../../../../src/model/ThunderstoreCombo';
import ThunderstoreMod from "../../../../src/model/ThunderstoreMod";
import ThunderstoreVersion from "../../../../src/model/ThunderstoreVersion";
import VersionNumber from "../../../../src/model/VersionNumber";
import { getFullDependencyList, InstallMode } from "../../../../src/utils/DependencyUtils";


beforeAll(() => {
    jest.mock('dexie');
});

// Unmock Dexie after these tests complete
afterAll(() => {
    jest.unmock('dexie');
});


const packageDefaultValues = {
    community: "RiskOfRain2",
    owner: "author",
    categories: [],
    dependencies: [],
}

function addMockPackage(modData: {
    name: string,
    dependencies?: string[],
    categories?: string[],
    versions: {
        version: string,
        dependencies?: string[]
    }[]
}) {
    const data = {
        ...packageDefaultValues,
        ...modData,
        full_name: `${packageDefaultValues.owner}-${modData.name}`,
        versions: modData.versions.map(v => ({
            version_number: v.version,
            dependencies: v.dependencies || [],
            name: `${packageDefaultValues.owner}-${modData.name}-${v.version}`
        }))
    };
    (Dexie as any).addMockPackage(data);

    const combo = new ThunderstoreCombo();

    const mod = new ThunderstoreMod();
    mod.setName(data.name);
    mod.setFullName(`${packageDefaultValues.owner}-${modData.name}`);
    mod.setDependencies(data.dependencies || []);
    mod.setCategories(data.categories || []);
    combo.setMod(mod);

    const version = new ThunderstoreVersion();
    const versionStr = data.versions[0].version_number;
    version.setVersionNumber(new VersionNumber(versionStr));
    version.setName(`${data.owner}-${data.name}-${versionStr}`);
    version.setDependencies(data.versions[0].dependencies || []);
    combo.setVersion(version);

    return combo;
}

let game: Game;

/*
 * NOTE:
 * These tests do NOT act as a spec for how the dependency resolver should work.
 * 
 * Some of the test cases test behaviour that isn't a part of the current usage, meaning if new usage is added, these tests might break.
 * In that case, if (after careful consideration) the tests seem incorrect, update them to match the new behaviour.
 */
describe("DependencyUtils.getFullDependencyList", () => {
    beforeEach(() => {
        (Dexie as any).resetMockPackages();

        game = new Game("", "RiskOfRain2", "", "", [], "", "", [], "",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []);
    });


    describe("Empty combo list", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, []],
            [InstallMode.UPDATE_ALL, []],
        ])
        ("", async (installMode, expected) => {
            const combos: ThunderstoreCombo[] = [];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("Single mod without dependencies", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-mod-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const combo = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });

            const combos = [combo];

            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("Single mod with a dependency", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithADependency-2.0.0", "author-mod-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithADependency-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const comboWithADependency = addMockPackage({
                name: "modWithADependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const combos = [comboWithADependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A mod pack with a dependency", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modPack-2.0.0", "author-mod-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modPack-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modPack = addMockPackage({
                name: "modPack",
                dependencies: ["author-mod-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modPack];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });

    describe("A mod pack first and a mod with the same dependency last", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modPack-2.0.0", "author-modWithDependency-2.0.0", "author-mod-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modPack-2.0.0", "author-modWithDependency-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modPack = addMockPackage({
                name: "modPack",
                dependencies: ["author-mod-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const modWithDependency = addMockPackage({
                name: "modWithDependency",
                dependencies: ["author-mod-2.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modPack, modWithDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });

    describe("A mod first and a mod pack with the same dependency last", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithDependency-2.0.0", "author-modPack-2.0.0", "author-mod-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithDependency-2.0.0", "author-modPack-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modWithDependency = addMockPackage({
                name: "modWithDependency",
                dependencies: ["author-mod-2.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const modPack = addMockPackage({
                name: "modPack",
                dependencies: ["author-mod-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modWithDependency, modPack];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("Two mods both having a dependency to the same mod", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-mod-2.0.0", "author-modWithDependency-2.0.0", "author-modWithTheSameDependency-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-mod-2.0.0", "author-modWithDependency-2.0.0", "author-modWithTheSameDependency-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modWithDependency = addMockPackage({
                name: "modWithDependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const modWithTheSameDependency = addMockPackage({
                name: "modWithTheSameDependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modWithDependency, modWithTheSameDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A mod with a deep dependency", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithDeepDependency-2.0.0", "author-modWithAnotherDependency-2.0.0", "author-anotherMod-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithDeepDependency-2.0.0", "author-modWithAnotherDependency-2.0.0", "author-anotherMod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const anotherMod = addMockPackage({
                name: "anotherMod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modWithAnotherDependency = addMockPackage({
                name: "modWithAnotherDependency",
                dependencies: ["author-anotherMod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-anotherMod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-anotherMod-1.0.0"]}
                ]
            });
            const modWithDeepDependency = addMockPackage({
                name: "modWithDeepDependency",
                dependencies: ["author-modWithAnotherDependency-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modWithAnotherDependency-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modWithAnotherDependency-1.0.0"]}
                ]
            });

            const combos = [modWithDeepDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A loop dependency of two mods, starting from the mod with a dependency to older version", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithLoopDependencyA-1.0.0", "author-modWithLoopDependencyB-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithLoopDependencyA-1.0.0", "author-modWithLoopDependencyB-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const modWithLoopDependencyA = addMockPackage({
                name: "modWithLoopDependencyA",
                dependencies: ["author-modWithLoopDependencyB-1.0.0"],
                versions: [
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependencyB-1.0.0"]},
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependencyB-1.0.0"]}
                ]
            });
            const modWithLoopDependencyB = addMockPackage({
                name: "modWithLoopDependencyB",
                dependencies: ["author-modWithLoopDependencyA-2.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependencyA-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependencyA-2.0.0"]}
                ]
            });

            const combos = [modWithLoopDependencyA];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A loop dependency of two mods, starting from the mod with a dependency to newer version", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithLoopDependencyB-1.0.0", "author-modWithLoopDependencyA-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithLoopDependencyB-1.0.0", "author-modWithLoopDependencyA-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const modWithLoopDependencyA = addMockPackage({
                name: "modWithLoopDependencyA",
                dependencies: ["author-modWithLoopDependencyB-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependencyB-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependencyB-1.0.0"]}
                ]
            });
            const modWithLoopDependencyB = addMockPackage({
                name: "modWithLoopDependencyB",
                dependencies: ["author-modWithLoopDependencyA-2.0.0"],
                versions: [
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependencyA-2.0.0"]},
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependencyA-2.0.0"]}
                ]
            });

            const combos = [modWithLoopDependencyB];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A loop dependency of a mod and a modpack, starting from the mod", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithLoopDependency-2.0.0", "author-modPackWithLoopDependency-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithLoopDependency-2.0.0", "author-modPackWithLoopDependency-1.0.0"]],
        ])
        ("", async (installMode, expected) => {
            addMockPackage({
                name: "modPackWithLoopDependency",
                dependencies: ["author-modWithLoopDependency-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependency-1.0.0"]},
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependency-1.0.0"]}
                ]
            });
            const modWithLoopDependency = addMockPackage({
                name: "modWithLoopDependency",
                dependencies: ["author-modPackWithLoopDependency-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modPackWithLoopDependency-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modPackWithLoopDependency-2.0.0"]}
                ]
            });

            const combos = [modWithLoopDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A loop dependency of a mod and a modpack, starting from the modpack", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modPackWithLoopDependency-1.0.0", "author-modWithLoopDependency-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modPackWithLoopDependency-1.0.0", "author-modWithLoopDependency-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const modPackWithLoopDependency = addMockPackage({
                name: "modPackWithLoopDependency",
                dependencies: ["author-modWithLoopDependency-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "1.0.0", dependencies: ["author-modWithLoopDependency-1.0.0"]},
                    {version: "2.0.0", dependencies: ["author-modWithLoopDependency-1.0.0"]}
                ]
            });
            addMockPackage({
                name: "modWithLoopDependency",
                dependencies: ["author-modPackWithLoopDependency-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modPackWithLoopDependency-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modPackWithLoopDependency-2.0.0"]}
                ]
            });

            const combos = [modPackWithLoopDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("A mod with two dependencies that have the same dependency", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithTwoDependeciesThatHaveTheSameDependency-2.0.0", "author-modWithDependency-2.0.0", "author-modWithTheSameDependency-2.0.0", "author-mod-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithTwoDependeciesThatHaveTheSameDependency-2.0.0", "author-modWithDependency-2.0.0", "author-modWithTheSameDependency-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modWithDependency = addMockPackage({
                name: "modWithDependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const modWithTheSameDependency = addMockPackage({
                name: "modWithTheSameDependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });
            const modWithTwoDependeciesThatHaveTheSameDependency = addMockPackage({
                name: "modWithTwoDependeciesThatHaveTheSameDependency",
                dependencies: ["author-modWithDependency-1.0.0", "author-modWithTheSameDependency-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-modWithDependency-2.0.0", "author-modWithTheSameDependency-2.0.0"]},
                    {version: "1.0.0", dependencies: ["author-modWithDependency-1.0.0", "author-modWithTheSameDependency-1.0.0"]}
                ]
            });

            const combos = [modWithTwoDependeciesThatHaveTheSameDependency];
            expectToContainOnly(await getFullDependencyList(combos, game, [], installMode), expected);
        });
    });


    describe("Single mod with a dependency to a mod that's already installed", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modWithDependency-2.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modWithDependency-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modWithDependency = addMockPackage({
                name: "modWithDependency",
                dependencies: ["author-mod-1.0.0"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modWithDependency];

            expectToContainOnly(await getFullDependencyList(
                combos,
                game,
                [new ManifestV2().fromThunderstoreCombo(mod)],
                installMode
            ), expected);
        });
    });


    describe("mod pack with it's dependency to a mod already installed", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modPack-2.0.0", "author-mod-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modPack-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modPack = addMockPackage({
                name: "modPack",
                dependencies: ["author-mod-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const combos = [modPack];
            const installedMod = new ManifestV2().fromThunderstoreCombo(mod);
            expectToContainOnly(await getFullDependencyList(combos, game, [installedMod], installMode), expected);
        });
    });


    describe("A mod pack with a dependency, with a newer version of the dependency already installed", () => {
        it.each([
            [InstallMode.INSTALL_SPECIFIC, ["author-modPack-2.0.0", "author-mod-1.0.0"]],
            [InstallMode.UPDATE_ALL, ["author-modPack-2.0.0", "author-mod-2.0.0"]],
        ])
        ("", async (installMode, expected) => {
            const mod = addMockPackage({
                name: "mod",
                versions: [
                    {version: "2.0.0"},
                    {version: "1.0.0"}
                ]
            });
            const modPack = addMockPackage({
                name: "modPack",
                dependencies: ["author-mod-1.0.0"],
                categories: ["Modpacks"],
                versions: [
                    {version: "2.0.0", dependencies: ["author-mod-1.0.0"]},
                    {version: "1.0.0", dependencies: ["author-mod-1.0.0"]}
                ]
            });

            const installedMod = new ManifestV2().fromThunderstoreCombo(mod);
            installedMod.setVersionNumber(new VersionNumber("2.0.0"));

            const combos = [modPack];
            expectToContainOnly(await getFullDependencyList(combos, game, [installedMod], installMode), expected);
        });
    });
});


function expectToContainOnly(combos: ThunderstoreCombo[], expected: string[]) {
    const dependencyStrings = combos.map(combo => combo.getDependencyString());
    expected.forEach((e) => {
        expect(dependencyStrings).toContain(e);
    })
    expect(combos).toHaveLength(expected.length);
}