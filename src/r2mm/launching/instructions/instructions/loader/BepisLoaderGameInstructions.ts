import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import { GameInstanceType } from '../../../../../model/schema/ThunderstoreSchema';
import path from '../../../../../providers/node/path/path';
import appWindow from '../../../../../providers/node/app/app_window';

export default class BepisLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const launchArgs: string[] = [
            '--hookfxr-enable',
            '--bepinex-target',
            path.join(DynamicGameInstruction.PROFILE_DIRECTORY, 'BepInEx'),
            '--doorstop-enabled',
            'true',
            '--doorstop-target-assembly',
            DynamicGameInstruction.BEPINEX_RENDERER_PRELOADER_PATH
        ];
        if (['linux', 'darwin'].includes(appWindow.getPlatform().toLowerCase())) {
            launchArgs.push(
                '--r2profile',
                DynamicGameInstruction.PROFILE_NAME
            );
            if (game.instanceType === GameInstanceType.SERVER) {
                launchArgs.push('--server');
            }
            if (await FsProvider.instance.exists(Profile.getActiveProfile().joinToProfilePath('unstripped_corlib'))) {
                launchArgs.push(
                    '--doorstop-mono-dll-search-path-override',
                    DynamicGameInstruction.BEPINEX_CORLIBS
                );
            }
        }
        return {
            moddedParameterList: launchArgs,
            vanillaParameterList: ['--hookfxr-disable', '--doorstop-enabled', 'false']
        };
    }

}
