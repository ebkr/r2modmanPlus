import { PackageLoader } from 'src/model/installing/PackageLoader';
import Game from 'src/model/game/Game';
import GameInstructionGenerator from 'src/r2mm/launching/instructions/instructions/GameInstructionGenerator';
import BepInExGameInstructions from 'src/r2mm/launching/instructions/instructions/loader/BepInExGameInstructions';
import MelonLoaderGameInstructions
    from 'src/r2mm/launching/instructions/instructions/loader/MelonLoaderGameInstructions';
import Profile from 'src/model/Profile';

export interface GameInstruction {
    moddedParameters: string,
    vanillaParameters: string
}

export default class GameInstructions {

    public static GAME_INSTRUCTIONS: Map<string, GameInstructionGenerator> = new Map();
    public static LOADER_INSTRUCTIONS: Map<PackageLoader, GameInstructionGenerator> = new Map([
        [PackageLoader.BEPINEX, new BepInExGameInstructions()],
        [PackageLoader.MELON_LOADER, new MelonLoaderGameInstructions()],
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
