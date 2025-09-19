import InMemoryFsProvider from '../../../../stubs/providers/InMemory.FsProvider';
import * as path from 'path';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {
    createManifest,
    installLogicBeforeEach,
    setupFolderStructureTestFiles,
    testStateTrackedFileStructure,
    testSubdirTrackedFileStructure,
    testUntrackedFileStructure
} from '../../../../utils/InstallLogicUtils';
import {describe, beforeAll, afterAll, test} from 'vitest';

let pkg: ManifestV2;

describe('GTFO Install Logic', () => {

    beforeAll(async () => {
        await installLogicBeforeEach("GTFO");
        pkg = createManifest('test_mod', 'author');
        await setupFolderStructureTestFiles(pkg);

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

        // Correct folder name casing conversion should happen within the ProfileInstaller.
        // Tests would get fairly heavily hard-coded if recorded here.
        InMemoryFsProvider.setMatchMode("CASE_INSENSITIVE");
    });

    afterAll(() => {
        InMemoryFsProvider.clear();
        InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
    })

    test('SUBDIR', async () => {
        await testSubdirTrackedFileStructure(pkg, [
            [path.join("BIE", "Plugins"), "BepInEx"],
            [path.join("BIE", "Monomod"), "BepInEx"],
            [path.join("BIE", "Patchers"), "BepInEx"],
            [path.join("BIE", "Core"), "BepInEx"],
            [path.join("BIE", "GameSpecific", "GTFO", "GameData"), "BepInEx"],
        ]);
    });

    test('NONE', async () => {
        await testUntrackedFileStructure([
            [path.join("BIE", "Config"), "BepInEx"],
        ]);
    });

    test('STATE', async () => {
        await testStateTrackedFileStructure(pkg, [
            [path.join("BIE", "GameSpecific", "GTFO", "Assets"), "BepInEx"],
        ]);
    });
});
