import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import path from 'path';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { GameInstanceType } from '../../../../../model/game/GameInstanceType';

export default class SkulTheHeroSlayerGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), ".doorstop_version"))) {
            const dvContent = (await FsProvider.instance.readFile(path.join(profile.getPathOfProfile(), ".doorstop_version"))).toString();
            const majorVersion = Number(dvContent.split(".")[0]);
            if (majorVersion === 4) {
                return this.genDoorstopV4(game, profile);
            }
        }
        // Fallback to V3.
        return this.genDoorstopV3(game, profile);
    }

    private async genDoorstopV3(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
        }

        // For this game, the corelibs are mandatory, so we can just delegate to the resolver.
        extraArguments += ` --doorstop-dll-search-override "${DynamicGameInstruction.SKUL_THE_HERO_SLAYER_CORELIBS}"`;

        return {
            moddedParameters: `--doorstop-enable true --doorstop-target "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enable false`
        };
    }

    private async genDoorstopV4(game: Game, profile: Profile): Promise<GameInstruction> {
        let extraArguments = "";
        if (["linux", "darwin"].includes(process.platform.toLowerCase())) {
            extraArguments += ` --r2profile "${DynamicGameInstruction.PROFILE_NAME}"`;
            if (game.instanceType === GameInstanceType.SERVER) {
                extraArguments += ` --server`;
            }
        }

        // For this game, the corelibs are mandatory, so we can just delegate to the resolver.
        extraArguments += ` --doorstop-mono-dll-search-path-override "${DynamicGameInstruction.SKUL_THE_HERO_SLAYER_CORELIBS}"`;

        return {
            moddedParameters: `--doorstop-enabled true --doorstop-target-assembly "${DynamicGameInstruction.BEPINEX_PRELOADER_PATH}"${extraArguments.trimEnd()}`,
            vanillaParameters: `--doorstop-enabled false`
        };
    }

}
