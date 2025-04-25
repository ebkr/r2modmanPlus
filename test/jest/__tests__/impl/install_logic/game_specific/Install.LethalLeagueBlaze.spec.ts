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

describe('Lethal League Blaze Install Logic', () => {

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
            .filter(value => value !== "populator.mjs");

        await installLogicBeforeEach("LethalLeagueBlaze");

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
