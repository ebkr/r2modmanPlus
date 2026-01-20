import GameInstructionGenerator from '../GameInstructionGenerator';
import {GameInstruction} from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';

export default class ShimloaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const luaDir = profile.joinToProfilePath("shimloader", "mod");
        const pakDir = profile.joinToProfilePath("shimloader", "pak");
        const cfgDir = profile.joinToProfilePath("shimloader", "cfg");

        return {
            moddedParameterList: [
                '--mod-dir', luaDir,
                '--pak-dir', pakDir,
                '--cfg-dir', cfgDir
            ],
            vanillaParameterList: []
        }
    }
}
