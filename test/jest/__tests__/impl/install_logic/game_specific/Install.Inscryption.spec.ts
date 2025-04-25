import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import * as path from 'path';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {
    createManifest,
    installLogicBeforeEach,
    setupFolderStructureTestFiles
} from '../../../../__utils__/InstallLogicUtils';

let pkg: ManifestV2;

describe('Inscryption Install Logic', () => {

    beforeAll(async () => {
        await installLogicBeforeEach("Inscryption");
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

        /** Expect files to be installed as intended **/
        const subdirPaths = [
            path.join("BIE", "Plugins"),
            path.join("BIE", "Monomod"),
            path.join("BIE", "Patchers"),
            path.join("BIE", "Core"),
        ]

        for (const value of subdirPaths) {
            const convertedName = `${value.replace(/[\/\\]/g, "_")}`;
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", path.basename(value), pkg.getName(), `${convertedName}_Files`, `${convertedName}_file.txt`)
            )).toBeTruthy();
        }
    });

    test('NONE', async () => {

        /** Expect files to be installed as intended **/
        const subdirPaths = [
            path.join("BIE", "Config"),
        ]

        InMemoryFsProvider.setMatchMode("CASE_INSENSITIVE");

        for (const value of subdirPaths) {
            const convertedName = `${value.replace(/[\/\\]/g, "_")}`;
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", path.basename(value), `${convertedName}_Files`, `${convertedName}_file.txt`)
            )).toBeTruthy();
        }
    });

});
