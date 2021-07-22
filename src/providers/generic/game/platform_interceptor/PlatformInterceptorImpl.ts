import { StorePlatform } from '../../../../model/game/StorePlatform';
import GameRunnerProvider from '../GameRunnerProvider';
import GameRunnerProviderImpl_Steam_Win from '../steam/win32/GameRunnerProviderImpl';
import GameRunnerProviderImpl_Steam_Linux from '../steam/linux/GameRunnerProviderImpl';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import GameDirectoryResolverImpl_Steam_Win from '../../../../r2mm/manager/win32/GameDirectoryResolver';
import GameDirectoryResolverImpl_Steam_Linux from '../../../../r2mm/manager/linux/GameDirectoryResolver';
import PlatformInterceptorProvider from '../platform_interceptor/PlatformInterceptorProvider';
import EGSDirectoryResolver from '../directory_resolver/win/EGSDirectoryResolver';
import DRMFreeDirectoryResolver from '../directory_resolver/win/DRMFreeDirectoryResolver';
import DirectExecutableGameRunnerProvider from '../steam/win32/DirectExecutableGameRunnerProvider';
import EgsRunnerProvider from '../steam/win32/EgsRunnerProvider';
import { PackageLoader } from '../../../../model/installing/PackageLoader';

type RunnerType = {
    [platkey in StorePlatform]: {
        [loader: number]: {
            [procKey: string]: GameRunnerProvider
        }
    }
};

type ResolverType = {
    [platkey in StorePlatform]: {
        [loader: number]: {
            [procKey: string]: GameDirectoryResolverProvider
        }
    }
};

const RUNNERS: RunnerType = {
    [StorePlatform.STEAM]: {
        [PackageLoader.BEPINEX]: {
            "win32": new GameRunnerProviderImpl_Steam_Win(),
            "linux": new GameRunnerProviderImpl_Steam_Linux()
        }
    },
    [StorePlatform.EPIC_GAMES_STORE]: {
        [PackageLoader.BEPINEX]: {
            "win32": new EgsRunnerProvider(),
            "linux": new EgsRunnerProvider(),
        }
    },
    [StorePlatform.OTHER]: {
        [PackageLoader.BEPINEX]: {
            "win32": new DirectExecutableGameRunnerProvider(),
            "linux": new DirectExecutableGameRunnerProvider(),
        }
    }
};

const RESOLVERS: ResolverType = {
    [StorePlatform.STEAM]: {
        [PackageLoader.BEPINEX]: {
            "win32": new GameDirectoryResolverImpl_Steam_Win,
            "linux": new GameDirectoryResolverImpl_Steam_Linux()
        }
    },
    [StorePlatform.EPIC_GAMES_STORE]: {
        [PackageLoader.BEPINEX]: {
            "win32": new EGSDirectoryResolver(),
            "linux": new DRMFreeDirectoryResolver()
        }
    },
    [StorePlatform.OTHER]: {
        [PackageLoader.BEPINEX]: {
            "win32": new DRMFreeDirectoryResolver(),
            "linux": new DRMFreeDirectoryResolver()
        }
    }
};

export default class PlatformInterceptorImpl extends PlatformInterceptorProvider {

    public getRunnerForPlatform(platform: StorePlatform, loader: PackageLoader): GameRunnerProvider | undefined {
        if (RUNNERS[platform][loader][process.platform] !== undefined) {
            return RUNNERS[platform][loader][process.platform];
        }
        return undefined;
    }

    public getDirectoryResolverForPlatform(platform: StorePlatform, loader: PackageLoader): GameDirectoryResolverProvider | undefined {
        if (RESOLVERS[platform][loader][process.platform] !== undefined) {
            return RESOLVERS[platform][loader][process.platform];
        }
        return undefined;
    }

}
