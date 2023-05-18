import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { GameInstanceType } from '../../../../../model/game/GameInstanceType';
import BepInExGameInstructions from 'src/r2mm/launching/instructions/instructions/loader/BepInExGameInstructions';

export default class BepInExGameInstructionsWithUnityLibsCorlibsResolver extends BepInExGameInstructions {

    public async genDoorstopV3(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
        }

        // For this game, the corelibs are mandatory, so we can just delegate to the resolver.
        extraArguments += ` --doorstop-dll-search-override "${DynamicGameInstruction.BEPINEX_CORLIBS_UNITYLIBS_PLUGIN}"`;

        return {
            moddedParameters: `--doorstop-enable true --doorstop-target "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enable false`
        };
    }

    public async genDoorstopV4(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
        }

        // For this game, the corelibs are mandatory, so we can just delegate to the resolver.
        extraArguments += ` --doorstop-mono-dll-search-path-override "${DynamicGameInstruction.BEPINEX_CORLIBS_UNITYLIBS_PLUGIN}"`;

        return {
            moddedParameters: `--doorstop-enabled true --doorstop-target-assembly "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enabled false`
        };
    }

}
