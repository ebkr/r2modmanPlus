import GameInstructionGenerator from 'src/r2mm/launching/instructions/instructions/GameInstructionGenerator';
import { GameInstruction } from 'src/r2mm/launching/instructions/GameInstructions';
import Game from 'src/model/game/Game';
import Profile from 'src/model/Profile';
import FsProvider from 'src/providers/generic/file/FsProvider';
import path from 'path';
import { DynamicGameInstruction } from 'src/r2mm/launching/instructions/DynamicGameInstruction';
import { GameInstanceType } from 'src/model/game/GameInstanceType';

export default class BepInExGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
            if (await FsProvider.instance.exists(path.join(Profile.getActiveProfile().getPathOfProfile(), "unstripped_corlib"))) {
                extraArguments += ` --doorstop-dll-search-override "${DynamicGameInstruction.BEPINEX_CORLIBS}"`;
            }
        }
        return {
            moddedParameters: `--doorstop-enable true --doorstop-target "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enable false`
        };
    }

}
