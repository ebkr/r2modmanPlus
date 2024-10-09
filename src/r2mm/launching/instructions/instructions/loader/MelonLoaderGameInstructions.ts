import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import { DynamicGameInstruction } from '../../DynamicGameInstruction';
import FsProvider from '../../../../../providers/generic/file/FsProvider';

export default class MelonLoaderGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        let moddedParameters = `--melonloader.basedir "${DynamicGameInstruction.PROFILE_DIRECTORY}"`;
        if (!await FsProvider.instance.exists(profile.joinToProfilePath('MelonLoader', 'Managed', 'Assembly-CSharp.dll'))) {
            console.log("Regenerating AGF")
           moddedParameters += " --melonloader.agfregenerate"
        }
        return {
            moddedParameters: moddedParameters,
            vanillaParameters: `--no-mods`
        };
    }
}
