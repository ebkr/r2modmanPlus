import GameRunnerProvider from '../../../../../generic/game/GameRunnerProvider';
import Game from '../../../../../../model/game/Game';
import Profile from '../../../../../../model/Profile';
import R2Error from '../../../../../../model/errors/R2Error';

export default class MLSteamGameRunnerProvider_Win extends GameRunnerProvider {
    async getGameArguments(game: Game, profile: Profile): Promise<string | R2Error> {
        return Promise.resolve("");
    }

    async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        return Promise.resolve(undefined);
    }

    async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        return Promise.resolve(undefined);
    }

}
