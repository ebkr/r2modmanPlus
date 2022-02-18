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
import MLSteamGameRunnerProvider_Win from '../steam/win32/melon_loader/MLSteamGameRunnerProvider_Win';
import MLDirectExecutableGameRunnerProvider from '../steam/win32/melon_loader/MLDirectExecutableGameRunnerProvider';
import MLSteamGameRunnerProvider_Linux from '../steam/linux/MLSteamGameRunnerProvider_Linux';
import DarwinGameRunnerProviderImpl from '../steam/darwin/DarwinGameRunnerProviderImpl';
import DarwinMLSteamGameRunnerProvider from '../steam/darwin/DarwinMLSteamGameRunnerProvider';
import DarwinGameDirectoryResolver from '../../../../r2mm/manager/darwin/DarwinGameDirectoryResolver';
import OriginGameRunnerProvider from 'src/providers/generic/game/steam/win32/OriginGameRunnerProvider';

type RunnerType = {
    [platkey in StorePlatform]: {
        [loader: number]: {
            [procKey: string]: GameRunnerProvider
        }
    }
};

type ResolverType = {
    [platkey in StorePlatform]: {
        [procKey: string]: GameDirectoryResolverProvider
    }
};

const RUNNERS: RunnerType = {
    [StorePlatform.STEAM]: {
        [PackageLoader.BEPINEX]: {
            "win32": new GameRunnerProviderImpl_Steam_Win(),
            "linux": new GameRunnerProviderImpl_Steam_Linux(),
            "darwin": new DarwinGameRunnerProviderImpl()
        },
        [PackageLoader.MELON_LOADER]: {
            "win32": new MLSteamGameRunnerProvider_Win(),
            "linux": new MLSteamGameRunnerProvider_Linux(),
            "darwin": new DarwinMLSteamGameRunnerProvider()
        }
    },
    [StorePlatform.EPIC_GAMES_STORE]: {
        [PackageLoader.BEPINEX]: {
            "win32": new EgsRunnerProvider(),
            "linux": new EgsRunnerProvider(),
            "darwin": new EgsRunnerProvider(),
        }
    },
    [StorePlatform.OCULUS_STORE]: {
        [PackageLoader.MELON_LOADER]: {
            "win32": new MLDirectExecutableGameRunnerProvider(),
            "linux": new MLDirectExecutableGameRunnerProvider(),
            "darwin": new MLDirectExecutableGameRunnerProvider(),
        }
    },
    [StorePlatform.ORIGIN]: {
      [PackageLoader.NORTHSTAR]: {
          "win32": new OriginGameRunnerProvider(),
          "linux": new OriginGameRunnerProvider(),
          "darwin": new OriginGameRunnerProvider(),
      }
    },
    [StorePlatform.OTHER]: {
        [PackageLoader.BEPINEX]: {
            "win32": new DirectExecutableGameRunnerProvider(),
            "linux": new DirectExecutableGameRunnerProvider(),
            "darwin": new DirectExecutableGameRunnerProvider(),
        }
    }
};

const RESOLVERS: ResolverType = {
    [StorePlatform.STEAM]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [StorePlatform.EPIC_GAMES_STORE]: {
        "win32": new EGSDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver(),
    },
    [StorePlatform.OCULUS_STORE]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [StorePlatform.ORIGIN]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [StorePlatform.OTHER]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    }
};

export default class PlatformInterceptorImpl extends PlatformInterceptorProvider {

    public getRunnerForPlatform(platform: StorePlatform, loader: PackageLoader): GameRunnerProvider | undefined {
        if (RUNNERS[platform][loader][process.platform] !== undefined) {
            return RUNNERS[platform][loader][process.platform];
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
