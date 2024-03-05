import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import * as path from 'path';

export default class SplotchGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const dsTarget = path.join(profile.getPathOfProfile(), "Splotch", "Splotch.dll");
        return {
            moddedParameters: `--doorstop-enabled true --doorstop-target "${dsTarget}"`,
            vanillaParameters: "--dorstop-enabled false"
        }
    }
}
