import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import path from 'path';
import {createFilesIntoProfile, installLogicBeforeEach} from '../../../utils/InstallLogicUtils';
import Profile from '../../../../../src/model/Profile';
import GameManager from '../../../../../src/model/game/GameManager';
import {PackageLoader, Platform} from '../../../../../src/model/schema/ThunderstoreSchema';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import GameDirectoryResolverProvider from '../../../../../src/providers/ror2/game/GameDirectoryResolverProvider';
import PlatformInterceptorImpl from '../../../../../src/providers/generic/game/platform_interceptor/PlatformInterceptorImpl';
import {provideAppWindowImplementation} from '../../../../../src/providers/node/app/app_window';
import {providePathImplementation} from '../../../../../src/providers/node/path/path';
import {TestAppWindowProvider} from '../../../stubs/providers/node/AppWindow.Provider';
import SettingsRedirectGameDirectoryResolver from '../../../stubs/providers/SettingsRedirectGameDirectoryResolver';
import GameInstructions from '../../../../../src/r2mm/launching/instructions/GameInstructions';
import ModLinker from '../../../../../src/r2mm/manager/ModLinker';

const runtimeFiles = ['winhttp.dll', 'mio-mod-loader/MioModLoader.dll', 'mio-mod-loader/runtimes/win-x64/native/asmjit.dll'];
const gameDirectory = path.resolve('MIO Game');

describe('MIO launch integration', () => {
    beforeEach(async () => {
        await installLogicBeforeEach('RiskofRainReturns');
        vi.spyOn(GameManager.activeGame, 'packageLoader', 'get').mockReturnValue(PackageLoader.MIO);
        provideAppWindowImplementation(() => TestAppWindowProvider);
        vi.spyOn(TestAppWindowProvider, 'getPlatform').mockReturnValue('win32');
        const resolver = new SettingsRedirectGameDirectoryResolver();
        vi.spyOn(resolver, 'getDirectory').mockResolvedValue(gameDirectory);
        GameDirectoryResolverProvider.provide(() => resolver);
        await FsProvider.instance.mkdirs(gameDirectory);
    });

    afterEach(() => vi.restoreAllMocks());

    test.each([
        {
            platform: 'win32',
            profilePath: 'C:\\Users\\Test User\\MIO\\Profile With Spaces',
            modsPath: 'C:\\Users\\Test User\\MIO\\Profile With Spaces\\mods',
            configPath: 'C:\\Users\\Test User\\MIO\\Profile With Spaces\\modconfig'
        },
        {
            platform: 'linux',
            profilePath: '/home/test user/MIO/Profile With Spaces',
            modsPath: 'Z:/home/test user/MIO/Profile With Spaces/mods',
            configPath: 'Z:/home/test user/MIO/Profile With Spaces/modconfig'
        }
    ])('Supplies isolated paths and a vanilla flag on $platform', async ({platform, profilePath, modsPath, configPath}) => {
        vi.spyOn(TestAppWindowProvider, 'getPlatform').mockReturnValue(platform);
        const profile = Profile.getActiveProfile();
        vi.spyOn(profile, 'getProfilePath').mockReturnValue(profilePath);
        vi.spyOn(FsProvider.instance, 'realpath').mockResolvedValue(profilePath);
        providePathImplementation(() => platform === 'win32' ? path.win32 : path.posix);
        const instructions = await GameInstructions.getInstructionsForGame(GameManager.activeGame, profile);

        expect(instructions).toEqual({
            moddedParameterList: ['--mods-path', modsPath, '--mods-config-path', configPath],
            vanillaParameterList: ['--vanilla']
        });
        expect(new PlatformInterceptorImpl().getRunnerForPlatform(Platform.STEAM, PackageLoader.MIO)).toBeDefined();
    });

    test('Links the proxy and runtime without copying mods or configuration', async () => {
        const profile = Profile.getActiveProfile();
        await createFilesIntoProfile([
            ...runtimeFiles, 'mods/Test-Mod/mod.json', 'modconfig/settings.json', 'mods.yml'
        ]);
        const linkedFiles = await ModLinker.link(profile.asImmutableProfile(), GameManager.activeGame);

        expect(linkedFiles).toEqual(expect.arrayContaining(runtimeFiles.map(file => path.join(gameDirectory, file))));
        expect(linkedFiles).toHaveLength(runtimeFiles.length);
        for (const file of runtimeFiles) {
            expect(await FsProvider.instance.exists(path.join(gameDirectory, file))).toBe(true);
        }
        for (const file of ['mods', 'modconfig', 'mods.yml']) {
            expect(await FsProvider.instance.exists(path.join(gameDirectory, file))).toBe(false);
        }
    });
});
