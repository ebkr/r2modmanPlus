import {
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    installLogicBeforeEach
} from '../../../../../jest/__utils__/InstallLogicUtils';
import R2Error from 'src/model/errors/R2Error';
import Profile from 'src/model/Profile';
import ProfileInstallerProvider from 'src/providers/ror2/installing/ProfileInstallerProvider';
import GenericProfileInstaller from 'src/r2mm/installing/profile_installers/GenericProfileInstaller';
import {describe, beforeEach, test, expect} from 'vitest';

describe('Shimloader Installer Tests', () => {

    beforeEach(
        () => installLogicBeforeEach("Palworld")
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
});
