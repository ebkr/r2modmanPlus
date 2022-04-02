import Game from '../../../../model/game/Game';
import type { GameInstruction } from '..//GameInstructions';
import Profile from '../../../../model/Profile';

export default abstract class GameInstructionGenerator {

    public abstract generate(game: Game, profile: Profile): Promise<GameInstruction>;

}
