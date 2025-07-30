import GameDirectoryResolverProvider from 'src/providers/ror2/game/GameDirectoryResolverProvider';
import R2Error from 'src/model/errors/R2Error';
import Game from 'src/model/game/Game';
import ManagerSettings from 'src/r2mm/manager/ManagerSettings';
import GameManager from 'src/model/game/GameManager';
import Profile from 'src/model/Profile';

export default class SettingsRedirectGameDirectoryResolver extends GameDirectoryResolverProvider {

    async getSteamDirectory(): Promise<string | R2Error> {
        return "TEST_STEAM_PATH"
    }

    async getDirectory(game: Game): Promise<string | R2Error> {
        return "TEST_GAME_DIRECTORY";
    }
}
