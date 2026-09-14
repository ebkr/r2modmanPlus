import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {
    createFilesIntoProfile,
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToExistInProfile,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import Profile from '../../../../../../src/model/Profile';
import GameManager from '../../../../../../src/model/game/GameManager';
import ModLoaderPackageMapping from '../../../../../../src/model/installing/ModLoaderPackageMapping';
import {PackageLoader} from '../../../../../../src/model/schema/ThunderstoreSchema';
import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import GenericProfileInstaller from '../../../../../../src/r2mm/installing/profile_installers/GenericProfileInstaller';
import {MODLOADER_PACKAGES} from '../../../../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';

const loaderFiles = [
    'winhttp.dll',
    'mio-mod-loader/MioModLoader.dll',
    'mio-mod-loader/MioModLoader.runtimeconfig.json',
    'mio-mod-loader/MioBinds.dll',
    'mio-mod-loader/PolyHook2.NET.dll',
    'mio-mod-loader/runtimes/win-x64/native/PolyHook_2.dll',
    'mio-mod-loader/runtimes/win-x64/native/asmjit.pdb'
];

const pluginFiles = ['mod.json', 'ExampleMod.dll', 'assets/patch.gin', 'localization.json'];

describe('MIO Installer Tests', () => {
    let installer: GenericProfileInstaller;

    beforeEach(async () => {
        await installLogicBeforeEach('RiskofRainReturns');
        vi.spyOn(GameManager.activeGame, 'packageLoader', 'get').mockReturnValue(PackageLoader.MIO);
        MODLOADER_PACKAGES.push(new ModLoaderPackageMapping('Test-MioModLoader', 'MioPack', PackageLoader.MIO));
        installer = new GenericProfileInstaller();
    });

    afterEach(() => vi.restoreAllMocks());

    test('Installs the mapped loader runtime without package metadata', async () => {
        const pkg = createManifest('MioModLoader', 'Test');
        const profile = Profile.getActiveProfile().asImmutableProfile();
        await createPackageFilesIntoCache(pkg, [
            ...loaderFiles.map(file => `MioPack/${file}`),
            'manifest.json', 'README.md', 'icon.png', 'MioPack/INSTALL.txt'
        ]);

        expect(await installer.installMod(pkg, profile)).toBeNull();
        await expectFilesToExistInProfile(loaderFiles);
        expect(await FsProvider.instance.exists(profile.joinToProfilePath('INSTALL.txt'))).toBe(false);
        expect(await FsProvider.instance.exists(profile.joinToProfilePath('manifest.json'))).toBe(false);
    });

    test('Uninstalls only loader files and tolerates missing files', async () => {
        const pkg = createManifest('MioModLoader', 'Test');
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const retained = ['mods/Other-Mod/mod.json', 'modconfig/settings.json', 'notes.txt', 'mods.yml'];
        await createFilesIntoProfile([...loaderFiles, ...retained]);

        expect(await installer.uninstallMod(pkg, profile)).toBeNull();
        for (const file of loaderFiles) {
            expect(await FsProvider.instance.exists(profile.joinToProfilePath(file))).toBe(false);
        }
        await expectFilesToExistInProfile(retained);
        expect(await installer.uninstallMod(pkg, profile)).toBeNull();
    });

    test('Does not enable or disable the loader', async () => {
        const pkg = createManifest('MioModLoader', 'Test');
        const profile = Profile.getActiveProfile().asImmutableProfile();
        await createFilesIntoProfile(loaderFiles);
        expect(await installer.disableMod(pkg, profile)).toBeUndefined();
        expect(await installer.enableMod(pkg, profile)).toBeUndefined();
        await expectFilesToExistInProfile(loaderFiles);
    });

    test.each(['', 'ExampleMod', 'plugins/ExampleMod', 'mods/ExampleMod'])(
        'Installs a plugin from "%s" with its manifest and assets intact', async (root) => {
            const pkg = createManifest('ExampleMod', 'Test');
            const profile = Profile.getActiveProfile().asImmutableProfile();
            const files = pluginFiles.map(file => root ? `${root}/${file}` : file);
            await createPackageFilesIntoCache(pkg, [...files, 'manifest.json', 'README.md', 'icon.png']);

            expect(await installer.installMod(pkg, profile)).toBeNull();
            await expectFilesToExistInProfile(pluginFiles.map(file => `mods/${pkg.getName()}/${file}`));
            expect(await FsProvider.instance.exists(profile.joinToProfilePath('mods', 'mod.json'))).toBe(false);
        }
    );

    test('Rejects packages without a mod folder', async () => {
        const pkg = createManifest('ExampleMod', 'Test');
        const profile = Profile.getActiveProfile().asImmutableProfile();
        await createPackageFilesIntoCache(pkg, ['manifest.json', 'ExampleMod.dll']);

        expect(await installer.installMod(pkg, profile)).not.toBeNull();
        expect(await FsProvider.instance.exists(profile.joinToProfilePath('mods', pkg.getName()))).toBe(false);
    });

    test('Disables, enables and uninstalls a plugin without touching other mods or configuration', async () => {
        const pkg = createManifest('ExampleMod', 'Test');
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const installed = pluginFiles.map(file => `mods/${pkg.getName()}/${file}`);
        const retained = ['mods/Other-Mod/mod.json', 'modconfig/settings.json'];
        await createPackageFilesIntoCache(pkg, pluginFiles);
        await createFilesIntoProfile(retained);
        expect(await installer.installMod(pkg, profile)).toBeNull();

        expect(await installer.disableMod(pkg, profile)).toBeUndefined();
        await expectFilesToExistInProfile(installed.map(file => `${file}.old`));
        expect(await FsProvider.instance.exists(profile.joinToProfilePath('mods', pkg.getName(), 'mod.json'))).toBe(false);
        await expectFilesToExistInProfile(retained);

        expect(await installer.enableMod(pkg, profile)).toBeUndefined();
        await expectFilesToExistInProfile(installed);
        expect(await installer.disableMod(pkg, profile)).toBeUndefined();
        expect(await installer.uninstallMod(pkg, profile)).toBeNull();
        expect(await FsProvider.instance.exists(profile.joinToProfilePath('mods', pkg.getName()))).toBe(false);
        await expectFilesToExistInProfile(retained);
    });
});
