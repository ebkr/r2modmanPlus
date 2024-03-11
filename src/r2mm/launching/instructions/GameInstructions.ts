import { PackageLoader } from '../../../model/installing/PackageLoader';
import Game from '../../../model/game/Game';
import GameInstructionGenerator from './instructions/GameInstructionGenerator';
import BepInExGameInstructions from './instructions/loader/BepInExGameInstructions';
import MelonLoaderGameInstructions from './instructions/loader/MelonLoaderGameInstructions';
import Profile from '../../../model/Profile';
import NorthstarGameInstructions from './instructions/loader/NorthstarGameInstructions';
import { GodotMLGameInstructions } from "../../launching/instructions/instructions/loader/GodotMLGameInstructions";
import { AncientVRGameInstructions } from "../../launching/instructions/instructions/loader/AncientVRGameInstructions";
import ShimloaderGameInstructions from './instructions/loader/ShimloaderGameInstructions';
import { NickelGameInstructions } from './instructions/loader/NickelGameInstructions';

export interface GameInstruction {
    moddedParameters: string,
    vanillaParameters: string
}

export default class GameInstructions {

    public static GAME_INSTRUCTIONS: Map<string, GameInstructionGenerator> = new Map();
    public static LOADER_INSTRUCTIONS: Map<PackageLoader, GameInstructionGenerator> = new Map([
        [PackageLoader.BEPINEX, new BepInExGameInstructions()],
        [PackageLoader.MELON_LOADER, new MelonLoaderGameInstructions()],
        [PackageLoader.NORTHSTAR, new NorthstarGameInstructions()],
        [PackageLoader.GODOT_ML, new GodotMLGameInstructions()],
        [PackageLoader.ANCIENT_DUNGEON_VR, new AncientVRGameInstructions()],
        [PackageLoader.SHIMLOADER, new ShimloaderGameInstructions()],
        [PackageLoader.NICKEL, new NickelGameInstructions()]
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
