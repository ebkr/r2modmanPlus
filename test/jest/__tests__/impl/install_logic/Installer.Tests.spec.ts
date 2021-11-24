import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../stubs/providers/InMemory.FsProvider';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import * as path from 'path';
import VersionNumber from '../../../../../src/model/VersionNumber';
import ManifestV2 from '../../../../../src/model/ManifestV2';
import Profile from '../../../../../src/model/Profile';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import ProfileInstallerProvider from '../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GameManager from 'src/model/game/GameManager';
import GenericProfileInstaller from 'src/r2mm/installing/profile_installers/GenericProfileInstaller';
import InstallationRuleApplicator from 'src/r2mm/installing/default_installation_rules/InstallationRuleApplicator';
import InstallationRules from 'src/r2mm/installing/InstallationRules';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

describe('Installer Tests', () => {

    describe('SUBDIR', () => {

        beforeEach(() => {
            const inMemoryFs = new InMemoryFsProvider();
            FsProvider.provide(() => inMemoryFs);
            InMemoryFsProvider.clear();
            PathResolver.MOD_ROOT = 'MODS';
            inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
            ProfileProvider.provide(() => new ProfileProviderImpl());
            new Profile('TestProfile');
            inMemoryFs.mkdirs(Profile.getActiveProfile().getPathOfProfile());
            GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "RiskOfRain2")!;
            InstallationRuleApplicator.apply();
            InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
        });

        test('Loose DLL', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "plugins", pkg.getName(), 'loose.dll'))).toBeTruthy();

        });

        test("Keep override folder structure", async () => {
            // Build dummy cache package
            const pkg = packageBuilder("test_mod", "auth", new VersionNumber("1.0.0"));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, "Plugins", "static_dir"));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, "Plugins", "static_dir", "structured.dll"), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, "Plugins", "static_dir", "structured.dll"))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "plugins", pkg.getName(), "static_dir", "structured.dll"))).toBeTruthy();

        });

        test("Flatten non-override structure", async () => {
            // Build dummy cache package
            const pkg = packageBuilder("test_mod", "auth", new VersionNumber("1.0.0"));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, "static_dir"));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, "static_dir", "structured.dll"), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, "static_dir", "structured.dll"))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "plugins", pkg.getName(), "structured.dll"))).toBeTruthy();

        });

        test('Default file extension', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.mm.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.mm.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "monomod", pkg.getName(), 'loose.mm.dll'))).toBeTruthy();

        });

    });

    describe("STATE", () => {

        beforeEach(() => {
            const inMemoryFs = new InMemoryFsProvider();
            FsProvider.provide(() => inMemoryFs);
            InMemoryFsProvider.clear();
            PathResolver.MOD_ROOT = 'MODS';
            inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
            ProfileProvider.provide(() => new ProfileProviderImpl());
            new Profile('TestProfile');
            inMemoryFs.mkdirs(Profile.getActiveProfile().getPathOfProfile());
            GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "BONEWORKS")!;
            InstallationRuleApplicator.apply();
        });

        test('Loose file', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            const coreRule = InstallationRules.RULES.find(value => value.gameName === GameManager.activeGame.internalFolderName)!;
            const defaultRuleSubtype = InstallationRules.getAllManagedPaths(coreRule.rules)
                .find(value => value.isDefaultLocation)!;

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), defaultRuleSubtype.route, 'loose.file'))).toBeTruthy();

        });

        test('One-level nested', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "userdata");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "UserData", 'loose.file'))).toBeTruthy();

        });

        test('Two-level nested', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "userdata", "CustomFolder");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "UserData", "CustomFolder", 'loose.file'))).toBeTruthy();

        });

        // .managed.dll rule points to /MelonLoader/Managed
        test('Default file extension placement', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.managed.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.managed.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "MelonLoader", "Managed", 'loose.managed.dll'))).toBeTruthy();

        });

    });

    describe("UNTRACKED/NONE", () => {

        beforeEach(() => {
            const inMemoryFs = new InMemoryFsProvider();
            FsProvider.provide(() => inMemoryFs);
            InMemoryFsProvider.clear();
            PathResolver.MOD_ROOT = 'MODS';
            inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
            ProfileProvider.provide(() => new ProfileProviderImpl());
            new Profile('TestProfile');
            inMemoryFs.mkdirs(Profile.getActiveProfile().getPathOfProfile());
            GameManager.activeGame = GameManager.gameList.find(value => value.internalFolderName === "RiskOfRain2")!;
            InstallationRuleApplicator.apply();
        });

        test('Config folder', async () => {
            // Build dummy cache package
            const pkg = packageBuilder('test_mod', 'auth', new VersionNumber('1.0.0'));

            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "Config");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(path.join(
                Profile.getActiveProfile().getPathOfProfile(), "BepInEx", "config", 'loose.file'))).toBeTruthy();

        });

    });

});

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
