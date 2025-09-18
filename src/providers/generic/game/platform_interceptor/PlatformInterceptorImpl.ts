import { Platform } from '../../../../model/schema/ThunderstoreSchema';
import GameRunnerProvider from '../GameRunnerProvider';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import GameDirectoryResolverImpl_Steam_Win from '../../../../r2mm/manager/win32/GameDirectoryResolver';
import GameDirectoryResolverImpl_Steam_Linux from '../../../../r2mm/manager/linux/GameDirectoryResolver';
import PlatformInterceptorProvider from '../platform_interceptor/PlatformInterceptorProvider';
import EGSDirectoryResolver from '../directory_resolver/win/EGSDirectoryResolver';
import XboxGamePassDirectoryResolver from '../directory_resolver/win/XboxGamePassDirectoryResolver';
import DRMFreeDirectoryResolver from '../directory_resolver/win/DRMFreeDirectoryResolver';
import { PackageLoader } from '../../../../model/schema/ThunderstoreSchema';
import DarwinGameDirectoryResolver from '../../../../r2mm/manager/darwin/DarwinGameDirectoryResolver';
import SteamGameRunner_Windows from '../../../../r2mm/launching/runners/windows/SteamGameRunner_Windows';
import DirectGameRunner from '../../../../r2mm/launching/runners/multiplatform/DirectGameRunner';
import SteamGameRunner_Linux from '../../../../r2mm/launching/runners/linux/SteamGameRunner_Linux';
import SteamGameRunner_Darwin from '../../../../r2mm/launching/runners/darwin/SteamGameRunner_Darwin';
import EgsGameRunner from '../../../../r2mm/launching/runners/multiplatform/EgsGameRunner';
import XboxGamePassGameRunner from '../../../../r2mm/launching/runners/windows/XboxGamePassGameRunner';
import appWindow from '../../../node/app/app_window';

type PlatformRunnersType = {
    [procKey: string]: GameRunnerProvider
}

type LoaderRunnersType = {
    [loader in PackageLoader]: PlatformRunnersType
}

type RunnerType = {
    [platkey in Platform]: LoaderRunnersType
};

type ResolverType = {
    [platkey in Platform]: {
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
        [PackageLoader.BEPISLOADER]: runners,
        [PackageLoader.MELONLOADER]: runners,
        [PackageLoader.NORTHSTAR]: runners,
        [PackageLoader.NONE]: runners,
        [PackageLoader.GODOTML]: runners,
        [PackageLoader.SHIMLOADER]: runners,
        [PackageLoader.LOVELY]: runners,
        [PackageLoader.RETURN_OF_MODDING]: runners,
        [PackageLoader.GDWEAVE]: runners,
        [PackageLoader.RECURSIVE_MELONLOADER]: runners,
    }
}

const RUNNERS: RunnerType = {
    [Platform.STEAM]: buildRunners(STEAM_RUNNERS),
    [Platform.STEAM_DIRECT]: buildRunners(DIRECT_RUNNERS),
    [Platform.EPIC_GAMES_STORE]: buildRunners(EGS_RUNNERS),
    [Platform.OCULUS_STORE]: buildRunners(DIRECT_RUNNERS),
    [Platform.ORIGIN]: buildRunners(DIRECT_RUNNERS),
    [Platform.XBOX_GAME_PASS]: buildRunners(XBOX_RUNNERS),
    [Platform.OTHER]: buildRunners(DIRECT_RUNNERS),
};

const RESOLVERS: ResolverType = {
    [Platform.STEAM]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [Platform.STEAM_DIRECT]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [Platform.EPIC_GAMES_STORE]: {
        "win32": new EGSDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver(),
    },
    [Platform.OCULUS_STORE]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [Platform.ORIGIN]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [Platform.XBOX_GAME_PASS]: {
        "win32": new XboxGamePassDirectoryResolver()
    },
    [Platform.OTHER]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    }
};

export default class PlatformInterceptorImpl extends PlatformInterceptorProvider {

    public getRunnerForPlatform(platform: Platform, loader: PackageLoader): GameRunnerProvider | undefined {
        if (RUNNERS[platform][loader][appWindow.getPlatform()] !== undefined) {
            return RUNNERS[platform][loader][appWindow.getPlatform()];
        }
        return undefined;
    }

    public getDirectoryResolverForPlatform(platform: Platform): GameDirectoryResolverProvider | undefined {
        if (RESOLVERS[platform][appWindow.getPlatform()] !== undefined) {
            return RESOLVERS[platform][appWindow.getPlatform()];
        }
        return undefined;
    }

}
