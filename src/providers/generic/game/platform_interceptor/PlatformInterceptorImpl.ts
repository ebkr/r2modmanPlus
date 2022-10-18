import { StorePlatform } from '../../../../model/game/StorePlatform';
import GameRunnerProvider from '../GameRunnerProvider';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import GameDirectoryResolverImpl_Steam_Win from '../../../../r2mm/manager/win32/GameDirectoryResolver';
import GameDirectoryResolverImpl_Steam_Linux from '../../../../r2mm/manager/linux/GameDirectoryResolver';
import PlatformInterceptorProvider from '../platform_interceptor/PlatformInterceptorProvider';
import EGSDirectoryResolver from '../directory_resolver/win/EGSDirectoryResolver';
import XGPDirectoryResolver from '../directory_resolver/win/XGPDirectoryResolver';
import DRMFreeDirectoryResolver from '../directory_resolver/win/DRMFreeDirectoryResolver';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import DarwinGameDirectoryResolver from '../../../../r2mm/manager/darwin/DarwinGameDirectoryResolver';
import SteamGameRunner_Windows from '../../../../r2mm/launching/runners/windows/SteamGameRunner_Windows';
import DirectGameRunner from '../../../../r2mm/launching/runners/multiplatform/DirectGameRunner';
import SteamGameRunner_Linux from '../../../../r2mm/launching/runners/linux/SteamGameRunner_Linux';
import SteamGameRunner_Darwin from '../../../../r2mm/launching/runners/darwin/SteamGameRunner_Darwin';
import EgsGameRunner from '../../../../r2mm/launching/runners/multiplatform/EgsGameRunner';

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
            "win32": new SteamGameRunner_Windows(),
            "linux": new SteamGameRunner_Linux(),
            "darwin": new SteamGameRunner_Darwin()
        },
        [PackageLoader.MELON_LOADER]: {
            "win32": new SteamGameRunner_Windows(),
            "linux": new SteamGameRunner_Linux(),
            "darwin": new SteamGameRunner_Darwin()
        }
    },
    [StorePlatform.STEAM_DIRECT]: {
        [PackageLoader.BEPINEX]: {
            "win32": new SteamGameRunner_Windows(),
            "linux": new SteamGameRunner_Linux(),
            "darwin": new SteamGameRunner_Darwin()
        },
        [PackageLoader.MELON_LOADER]: {
            "win32": new SteamGameRunner_Windows(),
            "linux": new SteamGameRunner_Linux(),
            "darwin": new SteamGameRunner_Darwin()
        },
        [PackageLoader.NORTHSTAR]: {
            "win32": new DirectGameRunner(),
            "linux": new DirectGameRunner(),
            "darwin": new DirectGameRunner()
        },
    },
    [StorePlatform.EPIC_GAMES_STORE]: {
        [PackageLoader.BEPINEX]: {
            "win32": new EgsGameRunner(),
            "linux": new EgsGameRunner(),
            "darwin": new EgsGameRunner(),
        }
    },
    [StorePlatform.OCULUS_STORE]: {
        [PackageLoader.MELON_LOADER]: {
            "win32": new DirectGameRunner(),
            "linux": new DirectGameRunner(),
            "darwin": new DirectGameRunner(),
        }
    },
    [StorePlatform.ORIGIN]: {
      [PackageLoader.NORTHSTAR]: {
          "win32": new DirectGameRunner(),
          "linux": new DirectGameRunner(),
          "darwin": new DirectGameRunner(),
      }
    },
    [StorePlatform.PC_GAME_PASS]: {
        [PackageLoader.BEPINEX]: {
            "win32": new DirectGameRunner(),
            "linux": new DirectGameRunner(),
            "darwin": new DirectGameRunner(),
        }
    },
    [StorePlatform.OTHER]: {
        [PackageLoader.BEPINEX]: {
            "win32": new DirectGameRunner(),
            "linux": new DirectGameRunner(),
            "darwin": new DirectGameRunner(),
        },
    }
};

const RESOLVERS: ResolverType = {
    [StorePlatform.STEAM]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [StorePlatform.STEAM_DIRECT]: {
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
    [StorePlatform.PC_GAME_PASS]: {
        "win32": new XGPDirectoryResolver(),
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
