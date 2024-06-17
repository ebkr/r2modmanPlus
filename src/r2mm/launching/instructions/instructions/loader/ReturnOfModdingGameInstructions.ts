import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import * as path from 'path';

export default class ReturnOfModdingGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--rom_modding_root_folder "${profile.getPathOfProfile()}"`,
            vanillaParameters: "--rom_enabled false"
        };
    }
}
