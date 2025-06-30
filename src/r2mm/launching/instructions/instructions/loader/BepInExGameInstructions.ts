import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { GameInstanceType } from '../../../../../model/schema/ThunderstoreSchema';
import { getUnityDoorstopVersion } from '../../../../../utils/UnityDoorstopUtils';

export default class BepInExGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const doorstopVersion = await getUnityDoorstopVersion(profile);
        switch (doorstopVersion) {
            case 4: return this.genDoorstopV4(game, profile);
            default: return this.genDoorstopV3(game, profile);
        }
    }

    private async genDoorstopV3(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(window.app.getPlatform().toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
            if (await FsProvider.instance.exists(Profile.getActiveProfile().joinToProfilePath("unstripped_corlib"))) {
                extraArguments += ` --doorstop-dll-search-override "${DynamicGameInstruction.BEPINEX_CORLIBS}"`;
            }
        }
        return {
            moddedParameters: `--doorstop-enable true --doorstop-target "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enable false`
        };
    }

    private async genDoorstopV4(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(window.app.getPlatform().toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
            if (await FsProvider.instance.exists(Profile.getActiveProfile().joinToProfilePath("unstripped_corlib"))) {
                extraArguments += ` --doorstop-mono-dll-search-path-override "${DynamicGameInstruction.BEPINEX_CORLIBS}"`;
            }
        }
        return {
            moddedParameters: `--doorstop-enabled true --doorstop-target-assembly "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enabled false`
        };
    }

}
