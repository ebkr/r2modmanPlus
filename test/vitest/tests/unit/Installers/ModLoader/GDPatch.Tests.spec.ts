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
import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import { updateModLoaderExports } from '../../../../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';
import {describe, beforeEach, afterEach, test, expect, vi} from 'vitest';

describe('GDPatch Installer Tests', () => {

    beforeEach(async () => {
        // WEBFISHING still uses GDWeave in the ecosystem data, so switch it to GDPatch and register the loader package.
        await installLogicBeforeEach('WEBFISHING');
        vi.spyOn(GameManager.activeGame, 'packageLoader', 'get').mockReturnValue(PackageLoader.GDPATCH);
        EcosystemModloaderPackages.value = [
            ...EcosystemModloaderPackages.value,
            { packageId: 'GDPatch-GDPatch', rootFolder: '', loader: PackageLoader.GDPATCH },
        ];
        updateModLoaderExports();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('Installs and uninstalls the mod loader', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('GDPatch', 'GDPatch');
        const sourceToExpectedDestination = {
            'winmm.dll': 'winmm.dll',
            'libgdpatch_loader.so': 'libgdpatch_loader.so',
            'libgdpatch_loader.dylib': 'libgdpatch_loader.dylib',
        };
        const untrackedFiles = [
            'GDPatch/config.toml',
            'GDPatch/mods/Author-ExampleMod/gdpatch_mod.toml',
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

    test.each(['', 'ExampleMod/', 'GDPatch/mods/ExampleMod/'])('Installs and uninstalls a mod from "%s"', async (modFolder) => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            [`${modFolder}gdpatch_mod.toml`]: `GDPatch/mods/${name}/gdpatch_mod.toml`,
            [`${modFolder}patcher.lua`]: `GDPatch/mods/${name}/patcher.lua`,
            [`${modFolder}data.pck`]: `GDPatch/mods/${name}/data.pck`,
        };
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, profile);
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, []);
    });

    test('Fails to install a mod without gdpatch_mod.toml', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        await createPackageFilesIntoCache(pkg, ['manifest.json', 'patcher.lua']);

        const result = await ProfileInstallerProvider.instance.installMod(pkg, profile);
        expect(result instanceof R2Error).toBeTruthy();
    });

    test('Disables and enables a mod', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const pkg = createManifest('ExampleMod', 'Author');
        const name = pkg.getName();
        const modFiles = [`GDPatch/mods/${name}/gdpatch_mod.toml`, `GDPatch/mods/${name}/patcher.lua`];
        const disabledMarker = `GDPatch/mods/${name}/gdpatch_disabled`;
        await createPackageFilesIntoCache(pkg, ['gdpatch_mod.toml', 'patcher.lua']);
        await ProfileInstallerProvider.instance.installMod(pkg, profile);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile([...modFiles, disabledMarker]);

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(modFiles);
        expect(await FsProvider.instance.exists(profile.joinToProfilePath(disabledMarker))).toBeFalsy();
    });
});
