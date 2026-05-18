import {
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import { PluginInstallers } from '../../../../../../src/installers/registry';
import { InstallRulePluginInstaller } from '../../../../../../src/installers/InstallRulePluginInstaller';
import { ShimloaderInstaller } from '../../../../../../src/installers/ShimloaderInstaller';
import { getInstallArgs } from '../../../../../../src/installers/PackageInstaller';
import { PackageLoader } from '../../../../../../src/model/schema/ThunderstoreSchema';
import Profile from '../../../../../../src/model/Profile';
import R2Error from '../../../../../../src/model/errors/R2Error';
import InMemoryFsProvider from '../../../../stubs/providers/InMemory.FsProvider';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GenericProfileInstaller from '../../../../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import { RuleSubtype } from '../../../../../../src/r2mm/installing/InstallationRules';
import { TrackingMethod } from '../../../../../../src/model/schema/ThunderstoreSchema';
import {describe, beforeEach, test, expect} from 'vitest';

function getShimloaderRules(includePakExtension: boolean): RuleSubtype[] {
    return [
        {
            route: 'shimloader/mod',
            isDefaultLocation: true,
            defaultFileExtensions: [],
            trackingMethod: TrackingMethod.SUBDIR,
            subRoutes: [],
        },
        {
            route: 'shimloader/pak',
            defaultFileExtensions: includePakExtension ? ['pak'] : [],
            trackingMethod: TrackingMethod.SUBDIR,
            subRoutes: [],
        },
        {
            route: 'shimloader/cfg',
            defaultFileExtensions: [],
            trackingMethod: TrackingMethod.NONE,
            subRoutes: [],
        },
    ];
}

describe('Shimloader Installer Tests', () => {
    describe('Schema-defined installRules', () => {

        beforeEach(async () => {
            await installLogicBeforeEach('Palworld');
            PluginInstallers[PackageLoader.SHIMLOADER] = new InstallRulePluginInstaller({
                gameName: 'Palworld',
                rules: getShimloaderRules(false),
                relativeFileExclusions: null,
            });
        });

        test('Installs and uninstalls a package', async () => {
            const pkg = createManifest("test_mod", "auth");
            const name = pkg.getName();
            const sourceToExpectedDestination = {
                "README.md": `shimloader/mod/${name}/README.md`,
                "manifest.json": `shimloader/mod/${name}/manifest.json`,
                "icon.png": `shimloader/mod/${name}/icon.png`,
                "pak/blueprint.pak": `shimloader/pak/${name}/blueprint.pak`,
                "mod/scripts/main.lua": `shimloader/mod/${name}/scripts/main.lua`,
                "mod/scripts/other.lua": `shimloader/mod/${name}/scripts/other.lua`,
                "mod/dll/mod.dll": `shimloader/mod/${name}/dll/mod.dll`,
                "cfg/package.cfg": `shimloader/cfg/package.cfg`,
            };
            const expectedAfterUninstall = [
                "shimloader/cfg/package.cfg",
            ];
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
            await expectFilesToBeCopied(sourceToExpectedDestination);

            const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile().asImmutableProfile());
            expect(result instanceof R2Error).toBeFalsy();
            await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
        });

        test('Loose .pak files route to schema default location when no extension rule exists', async () => {
            const pkg = createManifest("pak_mod", "auth");
            const name = pkg.getName();
            const sourceToExpectedDestination = {
                "manifest.json": `shimloader/mod/${name}/manifest.json`,
                "icon.png": `shimloader/mod/${name}/icon.png`,
                "loose_mod.pak": `shimloader/mod/${name}/loose_mod.pak`,
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
            await expectFilesToBeCopied(sourceToExpectedDestination);
        });
    });

    describe('Schema-defined installRules with pak extension rule', () => {

        beforeEach(async () => {
            await installLogicBeforeEach('Palworld');
            PluginInstallers[PackageLoader.SHIMLOADER] = new InstallRulePluginInstaller({
                gameName: 'Palworld',
                rules: getShimloaderRules(true),
                relativeFileExclusions: null,
            });
        });

        test('Loose .pak files route to shimloader/pak when schema defines .pak extension', async () => {
            const pkg = createManifest("pak_mod", "auth");
            const name = pkg.getName();
            const sourceToExpectedDestination = {
                "manifest.json": `shimloader/mod/${name}/manifest.json`,
                "icon.png": `shimloader/mod/${name}/icon.png`,
                "loose_mod.pak": `shimloader/pak/${name}/loose_mod.pak`,
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
            await expectFilesToBeCopied(sourceToExpectedDestination);
        });

        test('Subdirectory pak files still route to shimloader/pak', async () => {
            const pkg = createManifest("pak_subdir_mod", "auth");
            const name = pkg.getName();
            const sourceToExpectedDestination = {
                "manifest.json": `shimloader/mod/${name}/manifest.json`,
                "pak/blueprint.pak": `shimloader/pak/${name}/blueprint.pak`,
                "mod/scripts/main.lua": `shimloader/mod/${name}/scripts/main.lua`,
                "cfg/package.cfg": `shimloader/cfg/package.cfg`,
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
            await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
            await expectFilesToBeCopied(sourceToExpectedDestination);
        });
    });

    describe('Mod loader installation (case-sensitive FS)', () => {

        // Test https://github.com/ebkr/r2modmanPlus/issues/2079
        beforeEach(async () => {
            await installLogicBeforeEach("Palworld");
            InMemoryFsProvider.setMatchMode("CASE_SENSITIVE");
        });

        test("Installs new UE4SS.dll", async () => {
            const pkg = createManifest("unreal_shimloader", "Thunderstore");
            const sourceToExpectedDestination = {
                "dwmapi.dll": "dwmapi.dll",
                "UE4SS/UE4SS.dll": "ue4ss.dll",
                "UE4SS/UE4SS-settings.ini": "UE4SS-settings.ini",
                "UE4SS/Mods/shared/Types.lua": "shimloader/mod/shared/Types.lua",
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await new ShimloaderInstaller().install(getInstallArgs(pkg, profile));

            await expectFilesToBeCopied(sourceToExpectedDestination);
        });

        test("Installs old ue4ss.dll", async () => {
            const pkg = createManifest("unreal_shimloader", "Thunderstore");
            const sourceToExpectedDestination = {
                "dwmapi.dll": "dwmapi.dll",
                "UE4SS/ue4ss.dll": "ue4ss.dll",
                "UE4SS/UE4SS-settings.ini": "UE4SS-settings.ini",
                "UE4SS/Mods/shared/Types.lua": "shimloader/mod/shared/Types.lua",
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await new ShimloaderInstaller().install(getInstallArgs(pkg, profile));

            await expectFilesToBeCopied(sourceToExpectedDestination);
        });
    });
});
