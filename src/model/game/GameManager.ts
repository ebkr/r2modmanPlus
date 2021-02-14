import Game from '../../model/game/Game';

export default class GameManager {

    private static _activeGame: Game;

    private static _gameList = [
      new Game("Risk of Rain 2", 632360, "RiskOfRain2", "Risk of Rain 2.exe", "Risk of Rain 2_Data",
          "https://thunderstore.io/api/v1/package", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md"),

      new Game("Dyson Sphere Program", 1366540, "DysonSphereProgram", "DSPGAME.exe", "DSPGAME_Data",
          "https://dsp.thunderstore.io/api/v1/package", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md"),

      new Game("Valheim", 892970, "valheim.exe", "Valheim", "valheim_Data",
          "https://valheim.thunderstore.io/api/v1/package", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md"),

      new Game("Subnautica", 264710, "Subnautica", "Subnautica.exe", "Subnautica_Data",
          "https://subnautica.thunderstore.io/api/v1/package", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md"),
    ];

    static get activeGame(): Game {
        return this._activeGame;
    }

    static get gameList(): Game[] {
        return [...this._gameList];
    }

    static set activeGame(game: Game) {
        this._activeGame = game;
    }
}
