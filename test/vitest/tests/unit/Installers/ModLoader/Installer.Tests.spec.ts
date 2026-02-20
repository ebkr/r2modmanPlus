import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import PathResolver from '../../../../../../src/r2mm/manager/PathResolver';
import * as path from 'path';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GameManager from '../../../../../../src/model/game/GameManager';
import GenericProfileInstaller from '../../../../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import InstallationRules from '../../../../../../src/r2mm/installing/InstallationRules';
import { createManifest, installLogicBeforeEach } from '../../../../utils/InstallLogicUtils';
import { TrackingMethod } from '../../../../../../src/model/schema/ThunderstoreSchema';
import { describe, beforeAll, beforeEach, test, expect } from 'vitest';
import { replaceEcosystemWithRealData } from '../../../../utils/EcosystemTestHandler';
import { providePathImplementation } from '../../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../../stubs/providers/node/Node.Path.Provider';

describe('Installer Tests', () => {

    beforeAll(() => {
        replaceEcosystemWithRealData();
    });

    describe('SUBDIR', () => {

        beforeEach(async () => {
            providePathImplementation(() => TestPathProvider);
            await installLogicBeforeEach("RiskOfRain2");
        });

        test('Loose DLL', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", "plugins", pkg.getName(), 'loose.dll'))
            ).toBeTruthy();
        });

        test("Keep override folder structure", async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, "Plugins", "static_dir"));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, "Plugins", "static_dir", "structured.dll"), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, "Plugins", "static_dir", "structured.dll"))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", "plugins", pkg.getName(), "static_dir", "structured.dll")
            )).toBeTruthy();
        });

        test("Flatten non-override structure", async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, "cache", pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, "static_dir"));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, "static_dir", "structured.dll"), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, "static_dir", "structured.dll"))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", "plugins", pkg.getName(), "structured.dll")
            )).toBeTruthy();
        });

        test('Default file extension', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.mm.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.mm.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", "monomod", pkg.getName(), 'loose.mm.dll')
            )).toBeTruthy();
        });

    });

    describe('SUBDIR_NO_FLATTEN', () => {
        beforeEach(async () => {
            await installLogicBeforeEach('RiskOfRain2');
        });

        test('Copy to root', async () => {
            InstallationRules.RULES = [{
                gameName: 'RiskOfRain2',
                rules: [{
                    route: '.',
                    trackingMethod: TrackingMethod.SUBDIR_NO_FLATTEN,
                    subRoutes: [],
                    defaultFileExtensions: [],
                    isDefaultLocation: true
                }],
                relativeFileExclusions: null,
            }];

            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, 'folder', 'subfolder'));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'folder', 'subfolder', 'loose.file'), '');
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'manifest.json'), '');

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await ProfileInstallerProvider.instance.installMod(pkg, profile);

            expect(await FsProvider.instance.exists(
                profile.joinToProfilePath(pkg.getName(), 'folder', 'subfolder', 'loose.file')
            )).toBeTruthy();

            expect(await FsProvider.instance.exists(
                profile.joinToProfilePath(pkg.getName(), 'manifest.json')
            )).toBeTruthy();
        });

        test('No default location', async () => {
            InstallationRules.RULES = [{
                gameName: 'RiskOfRain2',
                rules: [{
                    route: '.',
                    trackingMethod: TrackingMethod.SUBDIR_NO_FLATTEN,
                    subRoutes: [],
                    defaultFileExtensions: [],
                    isDefaultLocation: false
                }],
                relativeFileExclusions: null,
            }];

            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(path.join(cachePkgRoot, 'folder'));
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'file'), '');

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await ProfileInstallerProvider.instance.installMod(pkg, profile);

            expect(await FsProvider.instance.exists(
                profile.joinToProfilePath(pkg.getName(), 'folder')
            )).toBeFalsy();

            expect(await FsProvider.instance.exists(
                profile.joinToProfilePath(pkg.getName(), 'file')
            )).toBeFalsy();
        });
    });

    describe("STATE", () => {

        beforeEach(async () => {
            await installLogicBeforeEach("BONEWORKS");
        });

        test('Loose file', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            const coreRule = InstallationRules.RULES.find(value => value.gameName === GameManager.activeGame.internalFolderName)!;
            const defaultRuleSubtype = InstallationRules.getAllManagedPaths(coreRule.rules)
                .find(value => value.isDefaultLocation)!;

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath(defaultRuleSubtype.route, 'loose.file')
            )).toBeTruthy();
        });

        test('One-level nested', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "userdata");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("UserData", 'loose.file')
            )).toBeTruthy();
        });

        test('Two-level nested', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "userdata", "CustomFolder");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("UserData", "CustomFolder", 'loose.file')
            )).toBeTruthy();
        });

        // .managed.dll rule points to /MelonLoader/Managed
        test('Default file extension placement', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            await FsProvider.instance.mkdirs(cachePkgRoot);
            await FsProvider.instance.writeFile(path.join(cachePkgRoot, 'loose.managed.dll'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cachePkgRoot, 'loose.managed.dll'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("MelonLoader", "Managed", 'loose.managed.dll')
            )).toBeTruthy();
        });

    });

    describe("UNTRACKED/NONE", () => {

        beforeEach(async () => {
            await installLogicBeforeEach("RiskOfRain2");
        });

        test('Config folder', async () => {
            const pkg = createManifest('test_mod', 'auth');
            const cachePkgRoot = path.join(PathResolver.MOD_ROOT, 'cache', pkg.getName(), pkg.getVersionNumber().toString());
            const cacheParentDir = path.join(cachePkgRoot, "Config");
            await FsProvider.instance.mkdirs(cacheParentDir);
            await FsProvider.instance.writeFile(path.join(cacheParentDir, 'loose.file'), '');

            // Ensure cachePkgRoot contains DLL
            expect(await FsProvider.instance.exists(path.join(cacheParentDir, 'loose.file'))).toBeTruthy();

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());

            // Expect DLL to be installed as intended
            expect(await FsProvider.instance.exists(
                Profile.getActiveProfile().joinToProfilePath("BepInEx", "config", 'loose.file')
            )).toBeTruthy();
        });

    });

});
