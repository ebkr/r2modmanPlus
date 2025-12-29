import GameInstructionGenerator from '../GameInstructionGenerator';
import {GameInstruction} from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';

export default class LovelyGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: ['--mod-dir', profile.joinToProfilePath('mods')],
            vanillaParameterList: ['--vanilla']
        };
    }
}
