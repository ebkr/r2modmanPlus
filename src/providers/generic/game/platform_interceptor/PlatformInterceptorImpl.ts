import { StorePlatform } from '../../../../model/game/StorePlatform';
import GameRunnerProvider from '../GameRunnerProvider';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import GameDirectoryResolverImpl_Steam_Win from '../../../../r2mm/manager/win32/GameDirectoryResolver';
import GameDirectoryResolverImpl_Steam_Linux from '../../../../r2mm/manager/linux/GameDirectoryResolver';
import PlatformInterceptorProvider from '../platform_interceptor/PlatformInterceptorProvider';
import EGSDirectoryResolver from '../directory_resolver/win/EGSDirectoryResolver';
import XboxGamePassDirectoryResolver from '../directory_resolver/win/XboxGamePassDirectoryResolver';
import DRMFreeDirectoryResolver from '../directory_resolver/win/DRMFreeDirectoryResolver';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import DarwinGameDirectoryResolver from '../../../../r2mm/manager/darwin/DarwinGameDirectoryResolver';
import SteamGameRunner_Windows from '../../../../r2mm/launching/runners/windows/SteamGameRunner_Windows';
import DirectGameRunner from '../../../../r2mm/launching/runners/multiplatform/DirectGameRunner';
import SteamGameRunner_Linux from '../../../../r2mm/launching/runners/linux/SteamGameRunner_Linux';
import SteamGameRunner_Darwin from '../../../../r2mm/launching/runners/darwin/SteamGameRunner_Darwin';
import EgsGameRunner from '../../../../r2mm/launching/runners/multiplatform/EgsGameRunner';
import XboxGamePassGameRunner from '../../../../r2mm/launching/runners/windows/XboxGamePassGameRunner';

type PlatformRunnersType = {
    [procKey: string]: GameRunnerProvider
}

type LoaderRunnersType = {
    [loader: number]: PlatformRunnersType
}

type RunnerType = {
    [platkey in StorePlatform]: LoaderRunnersType
};

type ResolverType = {
    [platkey in StorePlatform]: {
        [procKey: string]: GameDirectoryResolverProvider
    }
};

const STEAM_RUNNERS = {
    "win32": new SteamGameRunner_Windows(),
    "linux": new SteamGameRunner_Linux(),
    "darwin": new SteamGameRunner_Darwin(),
}

const DIRECT_RUNNERS = {
    "win32": new DirectGameRunner(),
    "linux": new DirectGameRunner(),
    "darwin": new DirectGameRunner(),
}

const EGS_RUNNERS = {
    "win32": new EgsGameRunner(),
    "linux": new EgsGameRunner(),
    "darwin": new EgsGameRunner(),
}

const XBOX_RUNNERS = {
    "win32": new XboxGamePassGameRunner()
}

function buildRunners(runners: PlatformRunnersType): LoaderRunnersType {
    return {
        [PackageLoader.BEPINEX]: runners,
        [PackageLoader.MELON_LOADER]: runners,
        [PackageLoader.NORTHSTAR]: runners,
        [PackageLoader.ANCIENT_DUNGEON_VR]: runners,
        [PackageLoader.GODOT_ML]: runners,
        [PackageLoader.SHIMLOADER]: runners,
        [PackageLoader.NICKEL]: runners,
    }
}

const RUNNERS: RunnerType = {
    [StorePlatform.STEAM]: buildRunners(STEAM_RUNNERS),
    [StorePlatform.STEAM_DIRECT]: buildRunners(DIRECT_RUNNERS),
    [StorePlatform.EPIC_GAMES_STORE]: buildRunners(EGS_RUNNERS),
    [StorePlatform.OCULUS_STORE]: buildRunners(DIRECT_RUNNERS),
    [StorePlatform.ORIGIN]: buildRunners(DIRECT_RUNNERS),
    [StorePlatform.XBOX_GAME_PASS]: buildRunners(XBOX_RUNNERS),
    [StorePlatform.OTHER]: buildRunners(DIRECT_RUNNERS),
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
    [StorePlatform.XBOX_GAME_PASS]: {
        "win32": new XboxGamePassDirectoryResolver()
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
