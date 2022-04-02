import GameInstructionGenerator from 'src/r2mm/launching/instructions/instructions/GameInstructionGenerator';
import { GameInstruction } from 'src/r2mm/launching/instructions/GameInstructions';
import Profile from 'src/model/Profile';
import Game from 'src/model/game/Game';
import { DynamicGameInstruction } from 'src/r2mm/launching/instructions/DynamicGameInstruction';

export default class MelonLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--melonloader.basedir "${DynamicGameInstruction.PROFILE_DIRECTORY}"`,
            vanillaParameters: `--no-mods`
        }
    }
}
