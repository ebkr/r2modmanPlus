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

describe('TS Dev No Flatten Install Logic', () => {

    beforeAll(async () => {
        await installLogicBeforeEach("ThunderstoreDev");
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

    test('SUBDIR_NO_FLATTEN', async () => {

        /** Expect files to be installed as intended **/
        const subdirPaths = [
            path.join("BIE", "GameSpecific", "ThunderstoreDev", "NoFlatten", "Sub"),
        ]

        for (const value of subdirPaths) {
            const convertedName = `${value.replace(/[\/\\]/g, "_")}`;
            const noFlattenDir = Profile.getActiveProfile().joinToProfilePath("BepInEx", "NoFlatten");
            // Add one to remove trailing path separator.
            const subdirPathAfterNoFlatten = value.substring(path.join("BIE", "GameSpecific", "ThunderstoreDev", "NoFlatten").length + 1);
            expect(await FsProvider.instance.exists(path.join(
                noFlattenDir, pkg.getName(), subdirPathAfterNoFlatten, `${convertedName}_Files`, `${convertedName}_file.txt`))).toBeTruthy();
        }
    });

    test('SUBDIR_NO_FLATTEN with unstructured files', async () => {

        /** Expect files to be installed as intended **/
        const subdirPaths = [
            path.join('BIE', 'GameSpecific', 'ThunderstoreDev', 'Also Sub'),
        ]

        for (const value of subdirPaths) {
            const noFlattenDir = Profile.getActiveProfile().joinToProfilePath("BepInEx", "NoFlatten");
            const convertedName = value.replace(/[\/\\]/g, "_");

            expect(await FsProvider.instance.exists(path.join(
                noFlattenDir, pkg.getName(), "Package", value, `${convertedName}_Files`, `${convertedName}_file.txt`
            ))).toBeTruthy();
        }
    });

});
