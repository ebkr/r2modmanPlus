import * as path from 'path';

import { describe, beforeEach, test, expect } from 'vitest';

import {
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import { getInstallArgs } from '../../../../../../src/installers/PackageInstaller';
import { RecursiveMelonLoaderInstaller } from '../../../../../../src/installers/RecursiveMelonLoaderInstaller';
import Profile from '../../../../../../src/model/Profile';
import VersionNumber from '../../../../../../src/model/VersionNumber';
import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';

async function expectFilesToBeAbsent(profileRelativePaths: string[]) {
    const profilePath = Profile.getActiveProfile().getProfilePath();

    for (const relativePath of profileRelativePaths) {
        const fullPath = path.join(profilePath, relativePath);
        expect(await FsProvider.instance.exists(fullPath)).toBeFalsy();
    }
}

function createModLoader() {
    return createManifest('MelonLoader', 'LavaGang', new VersionNumber('0.7.2'));
}

describe('RecursiveMelonLoader Installer Tests', () => {

    beforeEach(async () => {
        await installLogicBeforeEach('BabySteps');
    });

    describe('Installation', () => {

        test('Installs MelonLoader with only version.dll proxy', async () => {
            const pkg = createModLoader();
            const sourceToExpectedDestination = {
                'version.dll': 'version.dll',
                'MelonLoader/Dependencies/Bootstrap.dll': 'MelonLoader/Dependencies/Bootstrap.dll',
                'MelonLoader/net6/MelonLoader.dll': 'MelonLoader/net6/MelonLoader.dll',
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await new RecursiveMelonLoaderInstaller().install(getInstallArgs(pkg, profile));

            await expectFilesToBeCopied(sourceToExpectedDestination);
            await expectFilesToBeAbsent(['winhttp.dll']);
        });

        test('Installs MelonLoader with only winhttp.dll proxy', async () => {
            const pkg = createModLoader();
            const sourceToExpectedDestination = {
                'winhttp.dll': 'winhttp.dll',
                'MelonLoader/Dependencies/Bootstrap.dll': 'MelonLoader/Dependencies/Bootstrap.dll',
            };
            await createPackageFilesIntoCache(pkg, Object.keys(sourceToExpectedDestination));

            const profile = Profile.getActiveProfile().asImmutableProfile();
            await new RecursiveMelonLoaderInstaller().install(getInstallArgs(pkg, profile));

            await expectFilesToBeCopied(sourceToExpectedDestination);
            await expectFilesToBeAbsent(['version.dll']);
        });
    });

    describe('Uninstallation', () => {

        test('Removes every tracked file', async () => {
            const pkg = createModLoader();
            await createPackageFilesIntoCache(pkg, [
                'version.dll',
                'winhttp.dll',
                'MelonLoader/Dependencies/Bootstrap.dll',
            ]);

            const profile = Profile.getActiveProfile().asImmutableProfile();
            const installer = new RecursiveMelonLoaderInstaller();
            await installer.install(getInstallArgs(pkg, profile));
            await installer.uninstall(getInstallArgs(pkg, profile));

            await expectFilesToBeAbsent(['version.dll', 'winhttp.dll', 'MelonLoader']);
        });

        test('Ignores missing tracked files', async () => {
            const pkg = createModLoader();
            await createPackageFilesIntoCache(pkg, ['version.dll', 'MelonLoader/Dependencies/Bootstrap.dll']);

            const profile = Profile.getActiveProfile().asImmutableProfile();
            const installer = new RecursiveMelonLoaderInstaller();
            await installer.install(getInstallArgs(pkg, profile));
            await installer.uninstall(getInstallArgs(pkg, profile));

            await expectFilesToBeAbsent(['version.dll', 'MelonLoader']);
        });
    });
});
