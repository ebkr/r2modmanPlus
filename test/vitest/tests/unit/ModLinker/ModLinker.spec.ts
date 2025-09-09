import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import ModLinker from '../../../../../src/r2mm/manager/ModLinker';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import Profile from '../../../../../src/model/Profile';
import path from 'path';
import GameManager from '../../../../../src/model/game/GameManager';
import ManagerSettings from '../../../../../src/r2mm/manager/ManagerSettings';
import FileUtils from '../../../../../src/utils/FileUtils';
import GameDirectoryResolverProvider from '../../../../../src/providers/ror2/game/GameDirectoryResolverProvider';
import { ManagerSettingsInterfaceHolder } from '../../../../../src/r2mm/manager/SettingsDexieStore';
import InMemoryFsProvider from '../../../stubs/providers/InMemory.FsProvider';
import SettingsRedirectGameDirectoryResolver from '../../../stubs/providers/SettingsRedirectGameDirectoryResolver';
import { describe, beforeAll, test, expect } from 'vitest';
import { providePathImplementation } from '../../../../../src/providers/node/path/path';
import { TestPathProvider } from '../../../stubs/providers/node/Node.Path.Provider';
import { provideAppWindowImplementation } from '../../../../../src/providers/node/app/app_window';
import { TestAppWindowProvider } from '../../../stubs/providers/node/AppWindow.Provider';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

describe.skipIf(process.platform !== 'win32')('ModLinker', async () => {

    let settings!: ManagerSettings;

    beforeAll(async () => {
        providePathImplementation(() => TestPathProvider);
        provideAppWindowImplementation(() => TestAppWindowProvider);

        new Profile('TestProfile');

        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();
        PathResolver.MOD_ROOT = 'MODS';
        await inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
        ProfileProvider.provide(() => new ProfileProviderImpl());
        await inMemoryFs.mkdirs(Profile.getActiveProfile().getProfilePath());
        await GameDirectoryResolverProvider.provide(() => new SettingsRedirectGameDirectoryResolver());
        settings = await ManagerSettings.getSingleton(GameManager.defaultGame);
        await settings.load(true);
        // Hack to work around Dexie loading issue during test
        (ManagerSettings['CONTEXT'] as any) = ({
            global: {
                steamDirectory: 'TEST_STEAM_PATH'
            },
            gameSpecific: {
                gameDirectory: 'TEST_GAME_DIRECTORY'
            }
        } as ManagerSettingsInterfaceHolder);
        // await settings.setGameDirectory("GAME_DIR");
        await FileUtils.ensureDirectory(settings.getContext().gameSpecific.gameDirectory!);
    });

    test('Install, no existing files', async () => {
        const testFile = Profile.getActiveProfile().joinToProfilePath('test_file');
        await FsProvider.instance.writeFile(testFile, 'content');
        expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, 'test_file'))).toBeFalsy();
        await ModLinker.link(Profile.getActiveAsImmutableProfile(), GameManager.defaultGame);
        expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, 'test_file'))).toBeTruthy();
    });

    test('Install, file already exists, no overwrite', async () => {
        const testFile = Profile.getActiveProfile().joinToProfilePath('test_file');
        expect(await FsProvider.instance.exists(testFile)).toBeTruthy();
        const oldStat = await FsProvider.instance.stat(testFile);
        await new Promise(resolve => {
            setTimeout(async () => {
                await ModLinker.link(Profile.getActiveAsImmutableProfile(), GameManager.defaultGame);
                expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, 'test_file'))).toBeTruthy();
                const newStat = await FsProvider.instance.stat(testFile);
                expect(newStat.mtime).toEqual(oldStat.mtime);
                resolve(undefined);
            }, 30);
        });
    });

    test('Install, file already exists, overwritten', async () => {
        const testFile = Profile.getActiveProfile().joinToProfilePath('test_file');
        expect(await FsProvider.instance.exists(testFile)).toBeTruthy();
        const oldStat = await FsProvider.instance.stat(testFile);
        await FsProvider.instance.writeFile(testFile, 'modified');
        await new Promise(resolve => {
            setTimeout(async () => {
                await ModLinker.link(Profile.getActiveAsImmutableProfile(), GameManager.defaultGame);
                expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, 'test_file'))).toBeTruthy();
                const newStat = await FsProvider.instance.stat(testFile);
                expect(newStat.mtime).not.toEqual(oldStat.mtime);
                resolve(undefined);
            }, 30);
        });
    });

});
