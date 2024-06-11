import {
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    installLogicBeforeEach
} from '../../../__utils__/InstallLogicUtils';
import R2Error from '../../../../../src/model/errors/R2Error';
import Profile from '../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../src/providers/ror2/installing/ProfileInstallerProvider';


describe('ReturnOfModding Installer Tests', () => {
    beforeEach(
        () => installLogicBeforeEach("RiskofRainReturns")
    );

    test('Installs and uninstalls the package loader', async () => {
        const pkg = createManifest("ReturnOfModding", "ReturnOfModding");
        const sourceToExpectedDestination = {
            "ReturnOfModdingPack/version.dll": "version.dll",
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Installs and uninstalls a package', async () => {
        const pkg = createManifest("HelperFunctions", "Klehrik");
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            "README.md": `ReturnOfModding/plugins/${name}/README.md`,
            "CHANGELOG.md": `ReturnOfModding/plugins/${name}/CHANGELOG.md`,
            "manifest.json": `ReturnOfModding/plugins/${name}/manifest.json`,
            "icon.png": `ReturnOfModding/plugins/${name}/icon.png`,
            "main.lua": `ReturnOfModding/plugins/${name}/main.lua`,
            "custom-path-gets-flattened/path.txt": `ReturnOfModding/plugins/${name}/path.txt`,

            // TODO: These are based on the current install rules but the mod loader's
            // docs aren't clear if they are actually intended to be distributed with
            // the mods or automatically created by them.
            "plugins_data/data.dat": `ReturnOfModding/plugins_data/${name}/data.dat`,
            "config/config.cfg": `ReturnOfModding/config/${name}/config.cfg`,
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });
});
