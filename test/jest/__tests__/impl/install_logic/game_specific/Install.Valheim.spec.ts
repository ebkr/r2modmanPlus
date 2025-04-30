import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import * as path from 'path';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {
    createManifest,
    installLogicBeforeEach,
    setupFolderStructureTestFiles,
    testSubdirTrackedFileStructure,
    testUntrackedFileStructure
} from '../../../../__utils__/InstallLogicUtils';

let pkg: ManifestV2;

describe('Valheim Install Logic', () => {

    beforeAll(async () => {
        await installLogicBeforeEach("Valheim");
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
            path.join("BIE", "Plugins"),
            path.join("BIE", "Monomod"),
            path.join("BIE", "Patchers"),
            path.join("BIE", "Core"),
            path.join("BIE", "GameSpecific", "Valheim", "SlimVML"),
        ]);
    });

    test('NONE', async () => {
        await testUntrackedFileStructure(pkg, [
            path.join("BIE", "Config"),
        ]);
    });
});
