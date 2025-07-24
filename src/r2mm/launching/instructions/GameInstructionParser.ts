import { DynamicGameInstruction } from './DynamicGameInstruction';
import Profile from '../../../model/Profile';
import Game from '../../../model/game/Game';
import path from 'path';
import FsProvider from '../../../providers/generic/file/FsProvider';
import R2Error from '../../../model/errors/R2Error';
import * as process from 'process';
import { isProtonRequired } from '../../../utils/LaunchUtils';

export default class GameInstructionParser {

    public static PARSERS: Map<string, (game: Game, profile: Profile) => Promise<string | R2Error>> = new Map([
        [DynamicGameInstruction.BEPINEX_PRELOADER_PATH, GameInstructionParser.bepInExPreloaderPathResolver],
        [DynamicGameInstruction.PROFILE_DIRECTORY, GameInstructionParser.profileDirectoryResolver],
        [DynamicGameInstruction.BEPINEX_CORLIBS, GameInstructionParser.bepInExCorelibsPathResolver],
        [DynamicGameInstruction.PROFILE_NAME, GameInstructionParser.profileNameResolver],
        [DynamicGameInstruction.NORTHSTAR_DIRECTORY, GameInstructionParser.northstarDirectoryResolver],
        [DynamicGameInstruction.GDWEAVE_FOLDER, GameInstructionParser.gdweaveFolderResolver]
    ]);

    public static async parse(launchString: string, game: Game, profile: Profile): Promise<string | R2Error> {
        let resolvedString = launchString;
        for (let match of launchString.matchAll(new RegExp('@[a-zA-Z0-9]+', 'g'))) {
            const matchValue = match[0];
            if (this.PARSERS.has(matchValue)) {
                const replacement = await this.PARSERS.get(matchValue)!(game, profile);
                if (replacement instanceof R2Error) {
                    return replacement;
                }
                resolvedString = resolvedString.replace(new RegExp(matchValue, "g"), replacement);
            }
        }
        return resolvedString;
    }

    private static async profileDirectoryResolver(game: Game, profile: Profile): Promise<string> {
        return profile.getProfilePath();
    }

    private static async bepInExPreloaderPathResolver(game: Game, profile: Profile): Promise<string | R2Error> {
        try {
            if (["linux"].includes(process.platform.toLowerCase())) {
                const isProton = await isProtonRequired(game);
                const corePath = await FsProvider.instance.realpath(profile.joinToProfilePath("BepInEx", "core"));
                const preloaderPath = path.join(corePath,
                    (await FsProvider.instance.readdir(corePath))
                        .filter((x: string) => ["BepInEx.Unity.Mono.Preloader.dll", "BepInEx.Unity.IL2CPP.dll", "BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
                return `${isProton ? 'Z:' : ''}${preloaderPath}`;
            } else {
                const corePath = profile.joinToProfilePath("BepInEx", "core");
                return path.join(corePath,
                    (await FsProvider.instance.readdir(corePath))
                        .filter((x: string) => ["BepInEx.Unity.Mono.Preloader.dll", "BepInEx.Unity.IL2CPP.dll", "BepInEx.Preloader.dll", "BepInEx.IL2CPP.dll"].includes(x))[0]);
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to find preloader dll", err.message, "BepInEx may not be installed correctly. Further help may be required.");
        }
    }

    private static async bepInExCorelibsPathResolver(game: Game, profile: Profile): Promise<string | R2Error> {
        try {
            return await FsProvider.instance.realpath(profile.joinToProfilePath("unstripped_corlib"));
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Unable to resolver Corelibs folder", `"unstripped_corlib" folder failed. No such folder exists for path: ${Profile.getActiveProfile().getProfilePath()}.\nReason: ${err.message}`, null);
        }
    }

    private static async profileNameResolver(game: Game, profile: Profile): Promise<string> {
        return profile.getProfileName();
    }

    private static async northstarDirectoryResolver(game: Game, profile: Profile): Promise<string | R2Error> {
        return profile.joinToProfilePath("R2Northstar");
    }

    private static async gdweaveFolderResolver(game: Game, profile: Profile): Promise<string | R2Error> {
        return profile.joinToProfilePath("GDWeave");
    }
}
