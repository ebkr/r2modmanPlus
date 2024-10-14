import {
    createFilesIntoProfile,
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    expectFilesToExistInProfile,
    installLogicBeforeEach
} from '../../../__utils__/InstallLogicUtils';
import R2Error from '../../../../../src/model/errors/R2Error';
import Profile, { ImmutableProfile } from '../../../../../src/model/Profile';
import ProfileInstallerProvider from '../../../../../src/providers/ror2/installing/ProfileInstallerProvider';


describe('ReturnOfModding Installer Tests', () => {
    beforeEach(
        () => installLogicBeforeEach("RiskofRainReturns")
    );

    test('Installs and uninstalls the package loader', async () => {
        const pkg = createManifest("ReturnOfModding", "ReturnOfModding");
        const sourceToExpectedDestination = {
            "ReturnOfModdingPack/version.dll": "version.dll",  // RoRR
            "ReturnOfModdingPack/d3d12.dll": "d3d12.dll",  // Hades 2
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Disabling/enabling the mod loader does nothing', async () => {
        const pkg = createManifest("ReturnOfModding", "ReturnOfModding");
        const profile = new ImmutableProfile("TestProfile");
        const loaders = ["version.dll", "d3d12.dll"];
        await createFilesIntoProfile(loaders);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile(loaders);

        pkg.disable();

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(loaders);
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
            "custom-folder/file.txt": `ReturnOfModding/plugins/${name}/custom-folder/file.txt`,
            "plugins_data/data.dat": `ReturnOfModding/plugins_data/${name}/data.dat`,
            "config/config.cfg": `ReturnOfModding/config/${name}/config.cfg`,
        };
        const expectedAfterUninstall: string[] = [
            `ReturnOfModding/config/${name}/config.cfg`,
        ];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Package uninstall keeps plugins_data if it contains cache', async () => {
        const pkg = createManifest("HelperFunctions", "Klehrik");
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            "plugins_data/cache/data.dat": `ReturnOfModding/plugins_data/${name}/cache/data.dat`,
        };
        const expectedAfterUninstall: string[] = [
            `ReturnOfModding/plugins_data/${name}/cache/data.dat`,
        ];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Disabling/enabling a mod renames files', async () => {
        const pkg = createManifest("HelperFunctions", "Klehrik");
        const profile = new ImmutableProfile("TestProfile");
        const name = pkg.getName();
        const files = [
            `ReturnOfModding/plugins/${name}/main.lua`,
            `ReturnOfModding/plugins_data/${name}/data.dat`,
            `ReturnOfModding/plugins_data/${name}/cache/cache.dat`,
            `ReturnOfModding/config/${name}/config.cfg`,
        ];
        await createFilesIntoProfile(files);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile(files.map((fileName) => `${fileName}.old`));

        pkg.disable();

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(files);
    });
});
