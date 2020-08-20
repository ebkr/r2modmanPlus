import 'mocha';
import { expect } from 'chai';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import TestSetup from '../../test-setup.test';
import ManifestV2 from '../../../src/model/ManifestV2';
import ModListSort from '../../../src/r2mm/mods/ModListSort';
import { SortDirection } from '../../../src/model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../../src/model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../../src/model/real_enums/sort/SortNaming';
import InvalidManifestError from '../../../src/model/errors/Manifest/InvalidManifestError';

describe('ModListSort', () => {

    before(() => {
        TestSetup.setUp();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context("Basic sort tests", () => {

        // No change expected
        it("Default sort", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];
            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.CUSTOM, SortNaming.CUSTOM);
            for (let i=0; i<modList.length; i++) {
                expect(modList[i]).equals(sortedList[i]);
            }
        });

        // Expect results to be reversed
        it("Reverse sort", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];
            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.REVERSE, SortLocalDisabledMods.CUSTOM, SortNaming.CUSTOM);
            for (let i=0; i<modList.length; i++) {
                expect(modList[modList.length - 1 - i]).equals(sortedList[i]);
            }
        });

        // Sort based on mod name (flipped mod list order)
        it("Sort by name", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];
            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.CUSTOM, SortNaming.MOD_NAME);
            for (let i=0; i<modList.length; i++) {
                expect(modList[modList.length - 1 - i]).equals(sortedList[i]);
            }
        });

        // Sort based on mod name (flipped mod list order)
        it("Sort by author", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];
            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.CUSTOM, SortNaming.AUTHOR);
            for (let i=0; i<modList.length; i++) {
                expect(modList[modList.length - 1 - i]).equals(sortedList[i]);
            }
        });

    });

    context("Disabled sort mod tests", () => {

        // Default behaviour
        it("Disabled mods sort (CUSTOM)", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];

            modList[1].disable();

            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.CUSTOM, SortNaming.CUSTOM);
            for (let i=0; i<modList.length; i++) {
                expect(modList[i]).equals(sortedList[i]);
            }
        });

        // Expect disabled mods to be hidden
        it("Disabled mods sort (NONE)", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];

            modList[1].disable();

            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.NONE, SortNaming.CUSTOM);
            expect(sortedList.length).equals(1);
            expect(sortedList[0]).equals(modList[0]);
        });

        // Expect disabled mods to be hidden
        it("Disabled mods sort (FIRST)", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];

            modList[1].disable();

            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.FIRST, SortNaming.CUSTOM);
            for (let i=0; i<modList.length; i++) {
                expect(modList[modList.length - 1 - i]).equals(sortedList[i]);
            }
        });

        // Expect disabled mods to be hidden
        it("Disabled mods sort (LAST)", () => {
            const modList: ManifestV2[] = [
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorA-TestMod",
                    AuthorName: "AuthorA",
                    DisplayName: "TestMod",
                    Version: "1.0.0"
                }),
                new ManifestV2().make({
                    ManifestVersion: 2,
                    Name: "AuthorB-TestMod",
                    AuthorName: "AuthorB",
                    DisplayName: "TestMod2",
                    Version: "1.0.0"
                }),
            ] as ManifestV2[];

            modList[0].disable();

            const sortedList = ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.LAST, SortNaming.CUSTOM);
            for (let i=0; i<modList.length; i++) {
                expect(modList[modList.length - 1 - i]).equals(sortedList[i]);
            }
        });

    });

});
