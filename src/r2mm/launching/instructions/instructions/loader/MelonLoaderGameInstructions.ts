import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';

export default class MelonLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--melonloader.basedir "${DynamicGameInstruction.PROFILE_DIRECTORY}"`,
            vanillaParameters: `--no-mods`
        }
    }
}
