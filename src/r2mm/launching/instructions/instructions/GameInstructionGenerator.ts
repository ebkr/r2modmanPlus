import Game from 'src/model/game/Game';
import type { GameInstruction } from 'src/r2mm/launching/instructions/GameInstructions';
import Profile from 'src/model/Profile';

export default abstract class GameInstructionGenerator {

    public abstract generate(game: Game, profile: Profile): Promise<GameInstruction>;

}
