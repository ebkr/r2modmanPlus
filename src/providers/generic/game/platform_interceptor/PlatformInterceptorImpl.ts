import { StorePlatform } from '../../../../model/game/StorePlatform';
import GameRunnerProvider from '../GameRunnerProvider';
import GameRunnerProviderImpl_Steam_Win from '../steam/win32/GameRunnerProviderImpl';
import GameRunnerProviderImpl_Steam_Linux from '../steam/linux/GameRunnerProviderImpl';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import GameDirectoryResolverImpl_Steam_Win from '../../../../r2mm/manager/win32/GameDirectoryResolver';
import GameDirectoryResolverImpl_Steam_Linux from '../../../../r2mm/manager/linux/GameDirectoryResolver';
import PlatformInterceptorProvider from 'src/providers/generic/game/platform_interceptor/PlatformInterceptorProvider';

const RUNNERS: {[platKey in StorePlatform]: {[procKey: string]: GameRunnerProvider}} = {
    [StorePlatform.STEAM]: {
        "win32": new GameRunnerProviderImpl_Steam_Win(),
        "linux": new GameRunnerProviderImpl_Steam_Linux()
    },
    [StorePlatform.EPIC_GAMES_STORE]: {},
    [StorePlatform.OTHER]: {}
};

const RESOLVERS: {[platKey in StorePlatform]: {[procKey: string]: GameDirectoryResolverProvider}} = {
    [StorePlatform.STEAM]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux()
    },
    [StorePlatform.EPIC_GAMES_STORE]: {},
    [StorePlatform.OTHER]: {}
};

export default class PlatformInterceptorImpl extends PlatformInterceptorProvider {

    public getRunnerForPlatform(platform: StorePlatform): GameRunnerProvider | undefined {
        if (RUNNERS[platform][process.platform] !== undefined) {
            return RUNNERS[platform][process.platform];
        }
        return undefined;
    }

    public getDirectoryResolverForPlatform(platform: StorePlatform): GameDirectoryResolverProvider | undefined {
        if (RESOLVERS[platform][process.platform] !== undefined) {
            return RESOLVERS[platform][process.platform];
        }
        return undefined;
    }

}
