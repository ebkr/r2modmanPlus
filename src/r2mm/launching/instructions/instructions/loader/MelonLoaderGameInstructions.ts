import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import * as path from 'path';

export default class MelonLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        let moddedParameters = `--melonloader.basedir "${DynamicGameInstruction.PROFILE_DIRECTORY}"`;
        if (!await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), 'MelonLoader', 'Managed', 'Assembly-CSharp.dll'))) {
            console.log("Regenerating AGF")
           moddedParameters += " --melonloader.agfregenerate"
        }
        return {
            moddedParameters: moddedParameters,
            vanillaParameters: `--no-mods`
        };
    }
}
