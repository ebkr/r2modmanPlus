import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';

export default class NorthstarGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: ['-northstar', `-profile=${DynamicGameInstruction.NORTHSTAR_DIRECTORY}`],
            vanillaParameterList: ['-vanilla']
        }
    }
}
