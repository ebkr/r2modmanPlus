import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../../stubs/providers/InMemory.FsProvider';
import ModLinker from '../../../../../src/r2mm/manager/ModLinker';
import PathResolver from '../../../../../src/r2mm/manager/PathResolver';
import ProfileProvider from '../../../../../src/providers/ror2/model_implementation/ProfileProvider';
import Profile from '../../../../../src/model/Profile';
import path from 'path';
import GameManager from '../../../../../src/model/game/GameManager';
import ManagerSettings from '../../../../../src/r2mm/manager/ManagerSettings';
import FileUtils from '../../../../../src/utils/FileUtils';
import GameDirectoryResolverProvider from '../../../../../src/providers/ror2/game/GameDirectoryResolverProvider';
import SettingsRedirectGameDirectoryResolver from '../../stubs/providers/SettingsRedirectGameDirectoryResolver';
import { ManagerSettingsInterfaceHolder } from '../../../../../src/r2mm/manager/SettingsDexieStore';

class ProfileProviderImpl extends ProfileProvider {
    ensureProfileDirectory(directory: string, profile: string): void {
        FsProvider.instance.mkdirs(path.join(directory, profile));
    }
}

describe('ModLinker (win32)', () => {

    let settings!: ManagerSettings;

    beforeAll(async () => {
        const inMemoryFs = new InMemoryFsProvider();
        FsProvider.provide(() => inMemoryFs);
        InMemoryFsProvider.clear();
        PathResolver.MOD_ROOT = 'MODS';
        await inMemoryFs.mkdirs(PathResolver.MOD_ROOT);
        ProfileProvider.provide(() => new ProfileProviderImpl());
        new Profile('TestProfile');
        await inMemoryFs.mkdirs(Profile.getActiveProfile().getPathOfProfile());
        await GameDirectoryResolverProvider.provide(() => new SettingsRedirectGameDirectoryResolver());
        settings = await ManagerSettings.getSingleton(GameManager.unsetGame());
        await settings.load(true);
        // Hack to work around Dexie loading issue during test
        (ManagerSettings['CONTEXT'] as any) = ({
            global: {
                steamDirectory: "STEAM_DIR"
            },
            gameSpecific: {
                gameDirectory: "GAME_DIR"
            }
        } as ManagerSettingsInterfaceHolder)
        // await settings.setGameDirectory("GAME_DIR");
        await FileUtils.ensureDirectory(settings.getContext().gameSpecific.gameDirectory!);
    });

    test('Install, no existing files', async () => {
        const testFile = path.join(Profile.getActiveProfile().getPathOfProfile(), "test_file");
        await FsProvider.instance.writeFile(testFile, "content");
        expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, "test_file"))).toBeFalsy();
        await ModLinker.link(Profile.getActiveProfile(), GameManager.unsetGame());
        expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, "test_file"))).toBeTruthy();
    });

    test('Install, file already exists, no overwrite', async () => {
        const testFile = path.join(Profile.getActiveProfile().getPathOfProfile(), "test_file");
        expect(await FsProvider.instance.exists(testFile)).toBeTruthy();
        const oldStat = await FsProvider.instance.stat(testFile);
        await new Promise(resolve => {
            setTimeout(async () => {
                await ModLinker.link(Profile.getActiveProfile(), GameManager.unsetGame());
                expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, "test_file"))).toBeTruthy();
                const newStat = await FsProvider.instance.stat(testFile);
                expect(newStat.mtime).toEqual(oldStat.mtime);
                resolve();
            }, 30);
        });
    });

    test('Install, file already exists, overwritten', async () => {
        const testFile = path.join(Profile.getActiveProfile().getPathOfProfile(), "test_file");
        expect(await FsProvider.instance.exists(testFile)).toBeTruthy();
        const oldStat = await FsProvider.instance.stat(testFile);
        await FsProvider.instance.writeFile(testFile, "modified");
        await new Promise(resolve => {
            setTimeout(async () => {
                await ModLinker.link(Profile.getActiveProfile(), GameManager.unsetGame());
                expect(await FsProvider.instance.exists(path.join(settings.getContext().gameSpecific.gameDirectory!, "test_file"))).toBeTruthy();
                const newStat = await FsProvider.instance.stat(testFile);
                expect(newStat.mtime).not.toEqual(oldStat.mtime);
                resolve();
            }, 30);
        });
    });

});
