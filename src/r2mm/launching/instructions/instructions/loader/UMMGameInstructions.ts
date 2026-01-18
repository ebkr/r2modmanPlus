import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { getUnityDoorstopVersion } from '../../../../../utils/UnityDoorstopUtils';
import appWindow from '../../../../../providers/node/app/app_window';

export default class UMMGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const doorstopVersion = await getUnityDoorstopVersion(profile);
        switch (doorstopVersion) {
            case 4: return this.genDoorstopV4(game, profile);
            default: return this.genDoorstopV3(game, profile);
        }
    }

    private getProfileArgs(profile: Profile): string[] {
        if (["linux", "darwin"].includes(appWindow.getPlatform().toLowerCase())) {
            return ['--r2profile', DynamicGameInstruction.PROFILE_NAME];
        }
        return ['--profile', profile.getProfilePath()];
    }

    private async genDoorstopV3(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: [
                ...this.getProfileArgs(profile),
                '--doorstop-enable',
                'true',
                '--doorstop-target',
                DynamicGameInstruction.UMM_PRELOADER_PATH
            ],
            vanillaParameterList: ['--doorstop-enable', 'false']
        };
    }

    private async genDoorstopV4(game: Game, profile: Profile): Promise<GameInstruction> {
        return {
            moddedParameterList: [
                ...this.getProfileArgs(profile),
                '--doorstop-enabled',
                'true',
                '--doorstop-target-assembly',
                DynamicGameInstruction.UMM_PRELOADER_PATH
            ],
            vanillaParameterList: ['--doorstop-enabled', 'false']
        };
    }
}
