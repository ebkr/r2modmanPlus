import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';

export default class GDWeaveGameInstructions extends GameInstructionGenerator {
    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: [`--gdweave-folder-override=${DynamicGameInstruction.GDWEAVE_FOLDER}`],
            vanillaParameterList: ["--gdweave-disable"]
        };
    }
}
