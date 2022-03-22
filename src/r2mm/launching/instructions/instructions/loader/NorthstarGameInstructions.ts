import GameInstructionGenerator from 'src/r2mm/launching/instructions/instructions/GameInstructionGenerator';
import Game from 'src/model/game/Game';
import Profile from 'src/model/Profile';
import { GameInstruction } from 'src/r2mm/launching/instructions/GameInstructions';
import { DynamicGameInstruction } from 'src/r2mm/launching/instructions/DynamicGameInstruction';

export default class NorthstarGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `-profile="${DynamicGameInstruction.NORTHSTAR_DIRECTORY}"`,
            vanillaParameters: `-vanilla`
        }
    }
}
