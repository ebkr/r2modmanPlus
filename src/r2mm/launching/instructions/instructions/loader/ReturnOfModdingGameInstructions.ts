import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';

export default class ReturnOfModdingGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: ['--rom_modding_root_folder', profile.getProfilePath()],
            vanillaParameterList: ['--rom_enabled', 'false']
        };
    }
}
