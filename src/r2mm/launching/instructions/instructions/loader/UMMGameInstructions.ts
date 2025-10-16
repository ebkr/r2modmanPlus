import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';

export default class UMMGameInstructions extends GameInstructionGenerator {

    /**
     * TODO: define the launch arguments passed to Broforce when the game is
     * launched modded/vanilla. Check the other implementations in this folder
     * for examples if something more than the profile path is required.
     */
    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--profile "${profile.getProfilePath()}"`,
            vanillaParameters: ""
        };
    }
}
