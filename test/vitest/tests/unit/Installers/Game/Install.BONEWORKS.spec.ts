import InMemoryFsProvider from '../../../../stubs/providers/InMemory.FsProvider';
import * as path from 'path';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {
    createManifest,
    installLogicBeforeEach,
    setupFolderStructureTestFiles,
    testStateTrackedFileStructure
} from '../../../../utils/InstallLogicUtils';
import {describe, beforeAll, afterAll, test} from 'vitest';

let pkg: ManifestV2;

describe('BONEWORKS Install Logic', () => {

    beforeAll(async () => {
        await installLogicBeforeEach("BONEWORKS");
        pkg = createManifest('test_mod', 'author');
        await setupFolderStructureTestFiles(pkg);

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

        process.stdout.write(`Profile: ${Profile.getActiveProfile().getProfilePath()}\n`);

        // Correct folder name casing conversion should happen within the ProfileInstaller.
        // Tests would get fairly heavily hard-coded if recorded here.
        InMemoryFsProvider.setMatchMode("CASE_INSENSITIVE");
    });

    afterAll(() => {
        InMemoryFsProvider.clear();
        InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
    });

    test('STATE', async () => {
        await testStateTrackedFileStructure(pkg, [
            [path.join("ML", "MelonLoader"), "."],
            [path.join("ML", "Managed"), "MelonLoader"],
            [path.join("ML", "Libs"), "MelonLoader"],
            [path.join("ML", "UserLibs"), ""],
            [path.join("ML", "Mods"), "."],
            [path.join("ML", "Plugins"), "."],
            [path.join("ML", "UserData"), "."],
            [path.join("ML", "GameSpecific", "BONEWORKS", "CustomItems"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "CustomMaps"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "PlayerModels"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "CustomLoadScreens"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "Music"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "Food"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "Scoreworks"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "CustomSkins"), "UserData"],
            [path.join("ML", "GameSpecific", "BONEWORKS", "Grenades"), "UserData"],
        ]);
    });
});
