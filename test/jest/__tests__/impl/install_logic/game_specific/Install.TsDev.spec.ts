import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import PathResolver from '../../../../../../src/r2mm/manager/PathResolver';
import * as path from 'path';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import NodeFs from 'src/providers/generic/file/NodeFs';
import FileTree from 'src/model/file/FileTree';
import R2Error from 'src/model/errors/R2Error';
import { createManifest, installLogicBeforeEach } from '../../../../__utils__/InstallLogicUtils';

let pkg: ManifestV2;
let cachePkgRoot: string;

describe('TS Dev No Flatten Install Logic', () => {

    beforeAll(async () => {
        FsProvider.provide(() => new NodeFs());
        const baseFolderStructurePath = path.join(__dirname, "../../../../../folder-structure-testing");
        const tree = await FileTree.buildFromLocation(baseFolderStructurePath);
        if (tree instanceof R2Error) {
            throw new Error("Unable to find folder-structure-testing folder");
        }
        const allFiles = tree.getRecursiveFiles()
            .map(value => path.relative(baseFolderStructurePath, value))
            // Filter out file generation script.
            .filter(value => value !== "populator.mjs" && value !== "depopulator.mjs");

        await installLogicBeforeEach("ThunderstoreDev");

        pkg = createManifest('test_mod', 'author');
        cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());

        // Create cache from "folder-structure-testing" folder.
        for (const value of allFiles) {
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, path.dirname(value.trim())));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, value.trim()), "placeholder");
        }

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
