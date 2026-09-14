import GameInstructionGenerator from '../GameInstructionGenerator';
import {GameInstruction} from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import appWindow from '../../../../../providers/node/app/app_window';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import path from '../../../../../providers/node/path/path';

export default class MioGameInstructions extends GameInstructionGenerator {
    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const profilePath = appWindow.getPlatform() === 'linux'
            ? `Z:${await FsProvider.instance.realpath(profile.getProfilePath())}`
            : profile.getProfilePath();

        return {
            moddedParameterList: [
                '--mods-path', path.join(profilePath, 'mods'),
                '--mods-config-path', path.join(profilePath, 'modconfig')
            ],
            vanillaParameterList: ['--vanilla']
        };
    }
}
