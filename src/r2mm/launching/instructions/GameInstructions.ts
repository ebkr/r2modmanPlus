import { PackageLoader } from '../../../model/schema/ThunderstoreSchema';
import Game from '../../../model/game/Game';
import GameInstructionGenerator from './instructions/GameInstructionGenerator';
import BepInExGameInstructions from './instructions/loader/BepInExGameInstructions';
import MelonLoaderGameInstructions from './instructions/loader/MelonLoaderGameInstructions';
import Profile from '../../../model/Profile';
import NorthstarGameInstructions from './instructions/loader/NorthstarGameInstructions';
import { GodotMLGameInstructions } from "../../launching/instructions/instructions/loader/GodotMLGameInstructions";
import { CustomInstructions, ModsPathInstructions } from "./instructions/loader/CustomInstructions";
import ShimloaderGameInstructions from './instructions/loader/ShimloaderGameInstructions';
import LovelyGameInstructions from './instructions/loader/LovelyGameInstructions';
import ReturnOfModdingGameInstructions from './instructions/loader/ReturnOfModdingGameInstructions';
import GDWeaveGameInstructions from './instructions/loader/GDWeaveGameInstructions';
import BepisLoaderGameInstructions from './instructions/loader/BepisLoaderGameInstructions';
import UMMGameInstructions from './instructions/loader/UMMGameInstructions';
import RivetGameInstructions from './instructions/loader/RivetGameInstructions';

export interface GameInstruction {
    moddedParameters: string,
    vanillaParameters: string
}

export default class GameInstructions {

    public static GAME_INSTRUCTIONS: Map<string, GameInstructionGenerator> = new Map([
        ["AncientDungeonVR", new ModsPathInstructions()]
    ]);

    public static LOADER_INSTRUCTIONS: Map<PackageLoader, GameInstructionGenerator> = new Map([
        [PackageLoader.BEPINEX, new BepInExGameInstructions()],
        [PackageLoader.BEPISLOADER, new BepisLoaderGameInstructions()],
        [PackageLoader.MELONLOADER, new MelonLoaderGameInstructions()],
        [PackageLoader.RECURSIVE_MELONLOADER, new MelonLoaderGameInstructions()],
        [PackageLoader.NORTHSTAR, new NorthstarGameInstructions()],
        [PackageLoader.GODOTML, new GodotMLGameInstructions()],
        [PackageLoader.NONE, new CustomInstructions()],
        [PackageLoader.SHIMLOADER, new ShimloaderGameInstructions()],
        [PackageLoader.LOVELY, new LovelyGameInstructions()],
        [PackageLoader.RETURN_OF_MODDING, new ReturnOfModdingGameInstructions()],
        [PackageLoader.GDWEAVE, new GDWeaveGameInstructions()],
        [PackageLoader.UMM, new UMMGameInstructions()],
        [PackageLoader.RIVET, new RivetGameInstructions()],
    ]);

    public static async getInstructionsForGame(game: Game, profile: Profile): Promise<GameInstruction> {
        if (this.GAME_INSTRUCTIONS.has(game.internalFolderName)) {
            return await this.GAME_INSTRUCTIONS.get(game.internalFolderName)!.generate(game, profile);
        }
        if (this.LOADER_INSTRUCTIONS.has(game.packageLoader)) {
            return await this.LOADER_INSTRUCTIONS.get(game.packageLoader)!.generate(game, profile);
        }
        throw new Error(`No instructions found for game: ${game.internalFolderName}`);
    }

}
