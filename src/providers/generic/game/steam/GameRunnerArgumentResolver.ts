import Game from 'src/model/game/Game';
import Profile from 'src/model/Profile';
import path from 'path';
import R2Error from 'src/model/errors/R2Error';
import FsProvider from 'src/providers/generic/file/FsProvider';

const RESOLVERS: {[key: string]: (game: Game, profile: Profile) => Promise<string | R2Error>} = {
    "@bepInExPreloader": BepInExPreloaderResolver,
    "@profileDirectory": ProfileDirectoryResolver
}

export async function resolveArgs(launchArg: string, game: Game, profile: Profile): Promise<string | R2Error> {
    const matchSet = new Set<string>();
    for (let match of launchArg.matchAll(new RegExp('@[a-zA-Z]+'))) {
        matchSet.add(match[0]);
    }
    let result = launchArg;
    for (let match of matchSet) {
        const resolution = await RESOLVERS[match](game, profile);
        if (resolution instanceof R2Error) {
            return resolution;
        }
        result = result.replace(new RegExp(match, "g"), resolution)
    }
    return result;
}

async function BepInExPreloaderResolver(game: Game, profile: Profile): Promise<string | R2Error> {
    try {
        const corePath = path.join(profile.getPathOfProfile(), "BepInEx", "core");
        const preloaderPath = path.join(corePath,
            (await FsProvider.instance.readdir(corePath))
                .filter((x: string) => ["BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
        return `--doorstop-enable true --doorstop-target "${preloaderPath}"`;
    } catch (e) {
        const err: Error = e as Error;
        return new R2Error("Failed to find preloader dll", err.message, "BepInEx may not installed correctly. Further help may be required.");
    }
}

async function ProfileDirectoryResolver(game: Game, profile: Profile): Promise<string | R2Error> {
    return profile.getPathOfProfile();
}
