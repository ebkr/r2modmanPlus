import {
    createFilesIntoProfile,
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    expectFilesToExistInProfile,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import Profile, { ImmutableProfile } from '../../../../../../src/model/Profile';
import R2Error from '../../../../../../src/model/errors/R2Error';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {describe, beforeEach, test, expect} from 'vitest';

describe('UMMInstaller Tests', () => {
    beforeEach(
        () => installLogicBeforeEach("Broforce")
    );

    test('Installs and uninstalls the UMM package loader', async () => {
        const pkg = createManifest("UMM", "UMM");
        const sourceToExpectedDestination = {
            "UMM/Core/0Harmony.dll": "UMM/Core/0Harmony.dll",
            "UMM/Core/0Harmony.xml": "UMM/Core/0Harmony.xml",
            "UMM/Core/UnityModManager.dll": "UMM/Core/UnityModManager.dll",
            "doorstop_config.ini": "doorstop_config.ini",
            "winhttp.dll": "winhttp.dll",
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Disabling/enabling the mod loader does nothing', async () => {
        const pkg = createManifest("UMM", "UMM");
        const profile = new ImmutableProfile("TestProfile");
        const loaders = ["UMM/Core/UnityModManager.dll", "doorstop_config.ini", "winhttp.dll"];
        await createFilesIntoProfile(loaders);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile(loaders);

        pkg.disable();

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(loaders);
    });
});

describe('UMM Mod Tests (using InstallRules)', () => {
    beforeEach(
        () => installLogicBeforeEach("Broforce")
    );

    test('Installs and uninstalls a UMM mod to Mods folder', async () => {
        const pkg = createManifest("BroMaker", "TestAuthor");
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            "Mods/BroMaker/BroMakerLib.dll": `UMM/Mods/${name}/BroMaker/BroMakerLib.dll`,
            "Mods/BroMaker/Info.json": `UMM/Mods/${name}/BroMaker/Info.json`,
            "README.md": `UMM/Mods/${name}/README.md`,
            "manifest.json": `UMM/Mods/${name}/manifest.json`,
            "icon.png": `UMM/Mods/${name}/icon.png`,
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Installs a BroMaker bro to BroMaker_Storage folder', async () => {
        const pkg = createManifest("CustomBro", "TestAuthor");
        const name = pkg.getName();
        const sourceToExpectedDestination = {
            "BroMaker_Storage/Custom Bro/CustomBro.json": `UMM/BroMaker_Storage/${name}/Custom Bro/CustomBro.json`,
            "BroMaker_Storage/Custom Bro/CustomBro.mod.json": `UMM/BroMaker_Storage/${name}/Custom Bro/CustomBro.mod.json`,
            "BroMaker_Storage/Custom Bro/CustomBro.dll": `UMM/BroMaker_Storage/${name}/Custom Bro/CustomBro.dll`,
            "BroMaker_Storage/Custom Bro/sprite.png": `UMM/BroMaker_Storage/${name}/Custom Bro/sprite.png`,
        };
        const expectedAfterUninstall: string[] = [];
        await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

        await ProfileInstallerProvider.instance.installMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        await expectFilesToBeCopied(sourceToExpectedDestination);

        const result = await ProfileInstallerProvider.instance.uninstallMod(pkg, Profile.getActiveProfile().asImmutableProfile());
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(sourceToExpectedDestination, expectedAfterUninstall);
    });

    test('Disabling/enabling a mod renames files', async () => {
        const pkg = createManifest("BroMaker", "TestAuthor");
        const profile = new ImmutableProfile("TestProfile");
        const name = pkg.getName();
        const files = [
            `UMM/Mods/${name}/BroMaker/BroMakerLib.dll`,
            `UMM/Mods/${name}/README.md`,
            `UMM/Mods/${name}/manifest.json`,
        ];
        await createFilesIntoProfile(files);

        await ProfileInstallerProvider.instance.disableMod(pkg, profile);
        await expectFilesToExistInProfile(files.map((fileName) => `${fileName}.old`));

        pkg.disable();

        await ProfileInstallerProvider.instance.enableMod(pkg, profile);
        await expectFilesToExistInProfile(files);
    });
});
