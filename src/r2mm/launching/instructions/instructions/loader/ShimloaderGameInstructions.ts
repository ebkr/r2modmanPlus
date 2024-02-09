import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import * as path from 'path';

export default class ShimloaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const shimloader = path.join(profile.getPathOfProfile(), "shimloader");

        const luaDir = path.join(shimloader, "mod");
        const pakDir = path.join(shimloader, "pak");
        const cfgDir = path.join(shimloader, "cfg");

        return {
            moddedParameters: `--mod-dir "${luaDir}" --pak-dir "${pakDir}" --cfg-dir "${cfgDir}"`,
            vanillaParameters: `--disable-mods`
        }
    }
}
