import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import path from "path";

export default class BepisLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--hookfxr-enable --bepinex-target ${path.join(DynamicGameInstruction.PROFILE_DIRECTORY, 'BepInEx')}`,
            vanillaParameters: `--hookfxr-disable` // Intentionally use the wrong target
        }
    }

}
