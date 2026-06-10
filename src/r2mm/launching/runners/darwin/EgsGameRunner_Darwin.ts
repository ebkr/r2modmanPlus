import R2Error from "../../../../model/errors/R2Error";
import Game from "../../../../model/game/Game";
import Profile from "../../../../model/Profile";
import GameRunnerProvider from "../../../../providers/generic/game/GameRunnerProvider";
import DirectGameRunner from "../multiplatform/DirectGameRunner";

export default class EgsGameRunner_Darwin extends GameRunnerProvider {
    // Epic doesn't allow changing the executable run for an app like Steam does,
    // so if we want to use the wrapper for BepInEx support we need to call it directly.
    // As such, this class literally just launches Epic and then forwards the request to DirectGameRunner.
    private directGameRunner = new DirectGameRunner()

    public override getGameArguments(game: Game, profile: Profile): Promise<string[] | R2Error> {
        return this.directGameRunner.getGameArguments(game, profile);
    }

    public override startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        window.electron.openExternal('com.epicgames.launcher://');
        return this.directGameRunner.startModded(game, profile);
    }

    public override startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        window.electron.openExternal('com.epicgames.launcher://');
        return this.directGameRunner.startVanilla(game, profile);
    }
}
