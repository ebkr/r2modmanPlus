import {
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import R2Error from '../../../../../../src/model/errors/R2Error';
import Profile from '../../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import GenericProfileInstaller from '../../../../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import InstallationRules from '../../../../../../src/r2mm/installing/InstallationRules';
import {TrackingMethod} from '../../../../../../src/model/schema/ThunderstoreSchema';
import {describe, beforeEach, test, expect} from 'vitest';

describe('Shimloader Installer Tests', () => {

    describe('Default rules (no schema installRules)', () => {

        beforeEach(() => {
                installLogicBeforeEach('Palworld');
            }
        );

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
            expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall)
        });

        test('Loose .pak files go to shimloader/mod by default', async () => {
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

    describe('Schema-defined installRules override', () => {

        beforeEach(async () => {
            await installLogicBeforeEach('Palworld');

            // Override the schema rules for Palworld to simulate a game that
            // defines custom shimloader install rules (e.g. routing loose .pak
            // files to shimloader/pak via defaultFileExtensions).
            const existingRules = InstallationRules.RULES;
            const palworldIdx = existingRules.findIndex(r => r.gameName === 'Palworld');
            existingRules[palworldIdx] = {
                gameName: 'Palworld',
                rules: [
                    {
                        route: 'shimloader/mod',
                        isDefaultLocation: true,
                        defaultFileExtensions: [],
                        trackingMethod: TrackingMethod.SUBDIR,
                        subRoutes: [],
                    },
                    {
                        route: 'shimloader/pak',
                        defaultFileExtensions: ['pak'],
                        trackingMethod: TrackingMethod.SUBDIR,
                        subRoutes: [],
                    },
                    {
                        route: 'shimloader/cfg',
                        defaultFileExtensions: [],
                        trackingMethod: TrackingMethod.NONE,
                        subRoutes: [],
                    },
                ],
                relativeFileExclusions: null,
            };
            InstallationRules.RULES = existingRules;
        });

        test('Loose .pak files route to shimloader/pak when schema defines pak extension', async () => {
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
});
