import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { GameInstanceType } from '../../../../../model/schema/ThunderstoreSchema';
import path from 'path';

export default class BepisLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
            if (await FsProvider.instance.exists(Profile.getActiveProfile().joinToProfilePath("unstripped_corlib"))) {
                extraArguments += ` --doorstop-mono-dll-search-path-override "${DynamicGameInstruction.BEPINEX_CORLIBS}"`;
            }
        }
        return {
            moddedParameters: `--hookfxr-enable --bepinex-target "${path.join(DynamicGameInstruction.PROFILE_DIRECTORY, 'BepInEx')}" --doorstop-enabled true --doorstop-target-assembly "${DynamicGameInstruction.BEPINEX_RENDERER_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--hookfxr-disable --doorstop-enabled false`
        };
    }

}
