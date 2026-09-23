import {
    createFilesIntoProfile,
    createManifest,
    createPackageFilesIntoCache,
    expectFilesToBeCopied,
    expectFilesToBeRemoved,
    expectFilesToExistInProfile,
    installLogicBeforeEach
} from '../../../../utils/InstallLogicUtils';
import Profile from '../../../../../../src/model/Profile';
import VersionNumber from '../../../../../../src/model/VersionNumber';
import R2Error from '../../../../../../src/model/errors/R2Error';
import FsProvider from '../../../../../../src/providers/generic/file/FsProvider';
import ConflictManagementProvider from '../../../../../../src/providers/generic/installing/ConflictManagementProvider';
import ProfileInstallerProvider from '../../../../../../src/providers/ror2/installing/ProfileInstallerProvider';
import {describe, beforeEach, test, expect} from 'vitest';

describe('Lovely Installer Tests', () => {

    beforeEach(async () => {
        await installLogicBeforeEach('Balatro');
    });

    test('Uninstalls only lovely files', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const lovely = createManifest('lovely', 'Thunderstore');
        const plugin = createManifest('Steamodded', 'Steamodded');
        const lovelyFiles = {
            'version.dll': 'version.dll',
            'lovely/config.toml': 'mods/lovely/config.toml',
        };
        const pluginFiles = {
            'lovely/core.toml': 'mods/Steamodded-Steamodded/lovely/core.toml',
            'src/core.lua': 'mods/Steamodded-Steamodded/src/core.lua',
        };
        const untrackedFiles = [
            'mods/lovely/log/lovely.log',
            'mods/lovely/dump/game.lua',
            'notes.txt',
        ];
        await createPackageFilesIntoCache(lovely, Object.keys(lovelyFiles));
        await createPackageFilesIntoCache(plugin, Object.keys(pluginFiles));

        await ProfileInstallerProvider.instance.installMod(lovely, profile);
        await ProfileInstallerProvider.instance.installMod(plugin, profile);
        await createFilesIntoProfile(untrackedFiles);
        await expectFilesToBeCopied(lovelyFiles);

        const result = await ProfileInstallerProvider.instance.uninstallMod(lovely, profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(lovelyFiles, []);
        await expectFilesToExistInProfile([...Object.values(pluginFiles), ...untrackedFiles]);
        expect(await FsProvider.instance.exists(
            profile.joinToProfilePath('_state', 'Thunderstore-lovely-state.yml')
        )).toBeFalsy();
    });

    test('Removes the proxy DLL without a state file', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const lovely = createManifest('lovely', 'Thunderstore');
        await createFilesIntoProfile(['winmm.dll']);

        const result = await ProfileInstallerProvider.instance.uninstallMod(lovely, profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved({'winmm.dll': 'winmm.dll'}, []);
    });

    // Updates uninstall the old version before installing the new one.
    test('Upgrading from version.dll to winmm.dll leaves no stale state', async () => {
        const profile = Profile.getActiveProfile().asImmutableProfile();
        const oldLovely = createManifest('lovely', 'Thunderstore', new VersionNumber('0.9.0'));
        const newLovely = createManifest('lovely', 'Thunderstore', new VersionNumber('0.10.0'));
        await createPackageFilesIntoCache(oldLovely, ['version.dll', 'lovely/config.toml']);
        await createPackageFilesIntoCache(newLovely, ['winmm.dll', 'lovely/config.toml']);

        await ProfileInstallerProvider.instance.installMod(oldLovely, profile);
        await ProfileInstallerProvider.instance.uninstallMod(newLovely, profile);
        await ProfileInstallerProvider.instance.installMod(newLovely, profile);

        // Stale state entries would make this copy the old version.dll back into the profile.
        const result = await ConflictManagementProvider.instance.resolveConflicts([newLovely], profile);
        expect(result instanceof R2Error).toBeFalsy();
        await expectFilesToBeRemoved(
            {'version.dll': 'version.dll', 'winmm.dll': 'winmm.dll'},
            ['winmm.dll']
        );
    });
});
