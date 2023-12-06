import ManifestV2 from 'src/model/ManifestV2';
import FsProvider from '../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../stubs/providers/InMemory.FsProvider';
import * as path from 'path';
import ModListSort from 'src/r2mm/mods/ModListSort';
import { SortDirection } from 'src/model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from 'src/model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from 'src/model/real_enums/sort/SortNaming';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import VersionNumber from 'src/model/VersionNumber';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';



describe("ModListSort", () => {

    beforeEach(() => {
        FsProvider.provide(() => new InMemoryFsProvider());
        InMemoryFsProvider.clear();
    });

    test("New ManifestV2 getter/setter", async () => {
        let testManifest: ManifestV2 = new ManifestV2();
        const dateIn = new Date(1992, 10, 9);
        testManifest.setDateUpdated(dateIn);
        console.log(dateIn);
        console.log(testManifest.getDateUpdated());
        expect(testManifest.getDateUpdated() === dateIn).toBeTruthy();
    });

    // test ModListSort new sorting option
    test("New Sort Type", async () => {
        let testManifestA: ManifestV2 = new ManifestV2();
        let testManifestB: ManifestV2 = new ManifestV2();
        const farDate = new Date(2015, 2, 15);
        const closeDate = new Date(2015, 2, 16);
        testManifestA.setDateUpdated(closeDate);
        testManifestA.setName('first');
        testManifestB.setDateUpdated(farDate);
        testManifestB.setName('second');
        let modList: ManifestV2[] = [testManifestB, testManifestA];
        let updatedModList: ManifestV2[] = 
            ModListSort.sortLocalModList(modList, SortDirection.STANDARD, SortLocalDisabledMods.NONE, SortNaming.LAST_UPDATED);
        console.log("before");
        console.log(modList);
        console.log("after")
        console.log(updatedModList);
            expect(updatedModList[0] === testManifestA).toBeTruthy();
    });

    test("Update dateUpdated through fromThunderstoreMod()", async() => {
        let testTstoreMod: ThunderstoreMod = new ThunderstoreMod();
        let testTVersion: ThunderstoreVersion = new ThunderstoreVersion();
        const preTestDate = new Date(2222, 2, 22);
        const testDate = new Date(2023, 5, 12);
        testTstoreMod.setOwner('Bob');
        testTstoreMod.setName('Test Mod')
        testTstoreMod.setFullName('The Ultimate Test Mod');
        testTVersion.setDescription('test description');
        testTVersion.setDependencies(['none']);
        testTVersion.setVersionNumber(new VersionNumber('1.0.0'));
        testTstoreMod.setPackageUrl('test.com');

        testTstoreMod.setDateUpdated(testDate);
        let manifestFromT: ManifestV2 = new ManifestV2();
        manifestFromT.setDateUpdated(preTestDate);
        expect(manifestFromT.getDateUpdated() === preTestDate).toBeTruthy();
        manifestFromT.fromThunderstoreMod(testTstoreMod, testTVersion);
        expect(manifestFromT.getDateUpdated() === testDate).toBeTruthy();
    });

        test("Update dateUpdated through fromReactive()", async() => {
        let blankManifest: ManifestV2 = new ManifestV2();
        let inputManifest: ManifestV2 = new ManifestV2();
        const testDate1 = new Date(2020, 5, 29);
        const testDate2 = new Date(1995, 3, 14);
        inputManifest.setDateUpdated(testDate1);
        blankManifest.setDateUpdated(testDate2);
        expect(blankManifest.getDateUpdated() === testDate2).toBeTruthy();
        blankManifest.fromReactive(inputManifest);
        expect(blankManifest.getDateUpdated() === testDate1).toBeTruthy();
    });
});
