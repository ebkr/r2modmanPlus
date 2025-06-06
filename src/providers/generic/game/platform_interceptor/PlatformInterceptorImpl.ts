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
        [PackageLoader.Bepinex]: runners,
        [PackageLoader.Melonloader]: runners,
        [PackageLoader.Northstar]: runners,
        [PackageLoader.None]: runners,
        [PackageLoader.Godotml]: runners,
        [PackageLoader.Shimloader]: runners,
        [PackageLoader.Lovely]: runners,
        [PackageLoader.Returnofmodding]: runners,
        [PackageLoader.Gdweave]: runners,
        [PackageLoader.RecursiveMelonloader]: runners,
    }
}

const RUNNERS: RunnerType = {
    [Platform.Steam]: buildRunners(STEAM_RUNNERS),
    [Platform.SteamDirect]: buildRunners(DIRECT_RUNNERS),
    [Platform.EpicGamesStore]: buildRunners(EGS_RUNNERS),
    [Platform.OculusStore]: buildRunners(DIRECT_RUNNERS),
    [Platform.Origin]: buildRunners(DIRECT_RUNNERS),
    [Platform.XboxGamePass]: buildRunners(XBOX_RUNNERS),
    [Platform.Other]: buildRunners(DIRECT_RUNNERS),
};

const RESOLVERS: ResolverType = {
    [Platform.Steam]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [Platform.SteamDirect]: {
        "win32": new GameDirectoryResolverImpl_Steam_Win,
        "linux": new GameDirectoryResolverImpl_Steam_Linux(),
        "darwin": new DarwinGameDirectoryResolver()
    },
    [Platform.EpicGamesStore]: {
        "win32": new EGSDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver(),
    },
    [Platform.OculusStore]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [Platform.Origin]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    },
    [Platform.XboxGamePass]: {
        "win32": new XboxGamePassDirectoryResolver()
    },
    [Platform.Other]: {
        "win32": new DRMFreeDirectoryResolver(),
        "linux": new DRMFreeDirectoryResolver(),
        "darwin": new DRMFreeDirectoryResolver()
    }
};

export default class PlatformInterceptorImpl extends PlatformInterceptorProvider {

    public getRunnerForPlatform(platform: Platform, loader: PackageLoader): GameRunnerProvider | undefined {
        if (RUNNERS[platform][loader][process.platform] !== undefined) {
            return RUNNERS[platform][loader][process.platform];
        }
        return undefined;
    }

    public getDirectoryResolverForPlatform(platform: Platform): GameDirectoryResolverProvider | undefined {
        if (RESOLVERS[platform][process.platform] !== undefined) {
            return RESOLVERS[platform][process.platform];
        }
        return undefined;
    }

}
