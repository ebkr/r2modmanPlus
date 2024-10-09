import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import PathResolver from '../../../../../../src/r2mm/manager/PathResolver';
import * as path from 'path';
import VersionNumber from '../../../../../../src/model/VersionNumber';
import ManifestV2 from '../../../../../../src/model/ManifestV2';
import Profile from '../../../../../../src/model/Profile';
import ProfileProvider from '../../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GameManager from 'src/model/game/GameManager';
import GenericProfileInstaller from 'src/r2mm/installing/profile_installers/GenericProfileInstaller';
import InstallationRuleApplicator from 'src/r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import NodeFs from 'src/providers/generic/file/NodeFs';
import FileTree from 'src/model/file/FileTree';
import R2Error from 'src/model/errors/R2Error';
import ConflictManagementProvider from 'src/providers/generic/installing/ConflictManagementProvider';
import ConflictManagementProviderImpl from 'src/r2mm/installing/ConflictManagementProviderImpl';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

let packageBuilder = (name: string, author: string, version: VersionNumber): ManifestV2 => {
    /** ManifestV2::make ->
     *
     *  if (data.ManifestVersion === undefined) {
     *   return this.fromUnsupported(data);
     *  }
     *  this.setManifestVersion(2);
     *  this.setAuthorName(data.AuthorName || data.author || "Unknown");
     *  this.setName(data.Name || `${this.getAuthorName()}-${data.name}`);
     *  this.setWebsiteUrl(data.WebsiteURL || data.website_url || "");
     *  this.setDisplayName(data.DisplayName || data.name);
     *  this.setDescription(data.Description || data.description || "");
     *  this.setVersionNumber(new VersionNumber(data.Version || data.version_number));
     *  this.setDependencies(data.Dependencies || data.dependencies || []);
     *  return this;
     */
    return new ManifestV2().make({
        // Bare minimum for ManifestV2
        ManifestVersion: 2,
        AuthorName: author,
        Name: `${author}-${name}`,
        DisplayName: name,
        Version: version.toString()
    }) as ManifestV2;
};

let pkg: ManifestV2;
let cachePkgRoot: string;

describe('NASB Install Logic', () => {

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

        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();
        PathResolver.MOD_ROOT = 'MODS';
        await inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
        ProfileProvider.provide(() => new ProfileProviderImpl());
        new Profile('TestProfile');
        await inMemoryFs.mkdirs(Profile.getActiveProfile().getProfilePath());
        InstallationRuleApplicator.apply();

        ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());

        pkg = packageBuilder('test_mod', 'author', new VersionNumber('1.0.0'));
        cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());

        // Create cache from "folder-structure-testing" folder.
        for (const value of allFiles) {
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, path.dirname(value.trim())));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, value.trim()), "placeholder");
        }

        GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "NASB")!;

        ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
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
            path.join("BIE", "GameSpecific", "NASB", "Voicepacks"),
            path.join("BIE", "GameSpecific", "NASB", "Skins"),
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

    test('STATE', async () => {

        // [package_path, install_dir_relative_to_profile_folder]
        const subdirPaths = [
            [path.join('BIE', 'GameSpecific', 'NASB', 'CustomSongs'), path.join("BepInEx")],
            [path.join('BIE', 'GameSpecific', 'NASB', 'Movesets'), path.join('BepInEx')]
        ];

        InMemoryFsProvider.setMatchMode('CASE_INSENSITIVE');

        for (const value of subdirPaths) {
            const convertedName = `${value[0].replace(/[\/\\]/g, '_')}`;
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath(value[1], path.basename(value[0]), `${convertedName}_Files`, `${convertedName}_file.txt`)
            )).toBeTruthy();
            expect(FsProvider.instance.exists(Profile.getActiveProfile().joinToProfilePath('_state', `${pkg.getName()}.yml`)));
        }
    });

});
