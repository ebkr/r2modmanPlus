import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import appWindow from '../../../../../providers/node/app/app_window';
import path from '../../../../../providers/node/path/path';

export default class MioGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const isProton = appWindow.getPlatform() === 'linux';

        let profilePath = profile.getProfilePath();
        if (isProton) {
            profilePath = `Z:${await FsProvider.instance.realpath(profilePath)}`;
        }

        return {
            moddedParameterList: [
                '--mods-path', path.join(profilePath, 'mods'),
                '--mods-config-path', path.join(profilePath, 'modconfig'),
            ],
            vanillaParameterList: ['--vanilla']
        };
    }
}
