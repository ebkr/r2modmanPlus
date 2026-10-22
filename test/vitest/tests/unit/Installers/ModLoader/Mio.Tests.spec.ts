import {
    createFilesIntoProfile,
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    expectFilesToExistInProfile,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import GameManager from '../../../../../../src/model/game/GameManager';
import Profile from '../../../../../../src/model/Profile';
import R2Error from '../../../../../../src/model/errors/R2Error';
import { EcosystemModloaderPackages, PackageLoader } from '../../../../../../src/model/schema/ThunderstoreSchema';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import { updateModLoaderExports } from '../../../../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';
import {describe, beforeEach, afterEach, test, expect, vi} from 'vitest';

describe('MIO Installer Tests', () => {

    beforeEach(async () => {
        // MIO isn't in the ecosystem data yet, so borrow another game and register the loader package.
        await installLogicBeforeEach('RiskofRainReturns');
        vi.spyOn(GameManager.activeGame, 'packageLoader', 'get').mockReturnValue(PackageLoader.MIO);
        EcosystemModloaderPackages.value = [
            ...EcosystemModloaderPackages.value,
            { packageId: 'MIO_Modding-MioModLoader', rootFolder: 'MioModLoader', loader: PackageLoader.MIO },
        ];
        updateModLoaderExports();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('Installs and uninstalls the mod loader', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('MioModLoader', 'MIO_Modding');
        const sourceToExpectedDestination = {
            'MioModLoader/winhttp.dll': 'winhttp.dll',
            'MioModLoader/mio-mod-loader/MioModLoader.dll': 'mio-mod-loader/MioModLoader.dll',
            'MioModLoader/mio-mod-loader/runtimes/win-x64/native/PolyHook_2.dll': 'mio-mod-loader/runtimes/win-x64/native/PolyHook_2.dll',
        };
        const untrackedFiles = [
            'mods/Author-ExampleMod/mod.json',
            'modconfig/settings.json',
        ];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, profile);
        await createFilesIntoProfile(untrackedFiles);
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, []);
        await expectFilesToExistInProfile(untrackedFiles);
    });

    test.each(['', 'ExampleMod/', 'mods/ExampleMod/'])('Installs and uninstalls a mod from "%s"', async (modFolder) => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            [`${modFolder}mod.json`]: `mods/${name}/mod.json`,
            [`${modFolder}ExampleMod.dll`]: `mods/${name}/ExampleMod.dll`,
            [`${modFolder}assets/patch.gin`]: `mods/${name}/assets/patch.gin`,
        };
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, profile);
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, []);
    });

    test('Fails to install a mod without mod.json', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        await createPackageFilesIntoCache(pkg, ['manifest.json', 'ExampleMod.dll']);

        const result = await ProfileInstallerProvider.instance.installMod(pkg, profile);
        expect(result instanceof R2Error).toBeTruthy();
    });

    test('Disables and enables a mod', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        const name = pkg.getName();
        const modFiles = [`mods/${name}/mod.json`, `mods/${name}/ExampleMod.dll`];
        await createPackageFilesIntoCache(pkg, ['mod.json', 'ExampleMod.dll']);
        await ProfileInstallerProvider.instance.installMod(pkg, profile);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile(modFiles.map((file) => `${file}.old`));

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(modFiles);
    });
});
