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
// import ManifestV2
// import ModListSort
// how to make a mock manifestv2? I guess just use setters



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
            expect(updatedModList[0] === testManifestA);
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
        expect(manifestFromT.getDateUpdated() === preTestDate);
        manifestFromT.fromThunderstoreMod(testTstoreMod, testTVersion);
        expect(manifestFromT.getDateUpdated() === testDate);
    });

    // test whatever from reactive manifestv2 option

    test("Update dateUpdated through fromReactive()", async() => {
        
    });



    
    

});
