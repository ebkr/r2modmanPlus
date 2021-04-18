import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import Game from '../../../../../model/game/Game';
import R2Error from '../../../../../model/errors/R2Error';
import ManagerSettings from '../../../../../r2mm/manager/ManagerSettings';

export default class DRMFreeDirectoryResolver extends GameDirectoryResolverProvider {

    public async getDirectory(game: Game): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        return settings.getContext().gameSpecific.gameDirectory ||  new R2Error(
            `Unable to resolve the ${game.displayName} install directory`,
            "",
            `Try manually locating the ${game.displayName} install directory through the settings`
        )
    }

    public async getSteamDirectory(): Promise<string | R2Error> {
        return new R2Error("Directory shouldn't be retrieved for a non-steam game", "", null);
    }

}
