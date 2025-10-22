import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { getUnityDoorstopVersion } from '../../../../../utils/UnityDoorstopUtils';

export default class UMMGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const doorstopVersion = await getUnityDoorstopVersion(profile);
        switch (doorstopVersion) {
            case 4: return this.genDoorstopV4(game, profile);
            default: return this.genDoorstopV3(game, profile);
        }
    }

    private async genDoorstopV3(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        return {
            moddedParameters: `--profile "${profile.getProfilePath()}" --doorstop-enable true --doorstop-target "${DynamicGameInstruction.UMM_PRELOADER_PATH}"`,
            vanillaParameters: `--doorstop-enable false`
        };
    }

    private async genDoorstopV4(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameters: `--profile "${profile.getProfilePath()}" --doorstop-enabled true --doorstop-target-assembly "${DynamicGameInstruction.UMM_PRELOADER_PATH}"`,
            vanillaParameters: `--doorstop-enabled false`
        };
    }
}
