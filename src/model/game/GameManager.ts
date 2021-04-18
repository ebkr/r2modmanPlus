import Game from '../../model/game/Game';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { StorePlatform } from '../../model/game/StorePlatform';
import { GameSelectionDisplayMode } from '../../model/game/GameSelectionDisplayMode';

export default class GameManager {

    private static _activeGame: Game;

    private static _gameList = [
        new Game('Risk of Rain 2', 'RiskOfRain2',
            'Risk of Rain 2', 'Risk of Rain 2.exe', 'Risk of Rain 2_Data',
            'https://thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "632360")], "RiskOfRain2.jpg", GameSelectionDisplayMode.VISIBLE),

        new Game('Dyson Sphere Program', 'DysonSphereProgram',
            'Dyson Sphere Program', 'DSPGAME.exe', 'DSPGAME_Data',
            'https://dsp.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "1366540")], "DysonSphereProgram.jpg", GameSelectionDisplayMode.VISIBLE),

        new Game('Valheim', 'Valheim',
            'Valheim', 'valheim.exe', 'valheim_Data',
            'https://valheim.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "892970")], "Valheim.jpg", GameSelectionDisplayMode.VISIBLE),
        new Game('GTFO', 'GTFO',
            'GTFO', 'GTFO.exe', 'GTFO_Data',
            'https://gtfo.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "493520")], "GTFO.jpg", GameSelectionDisplayMode.VISIBLE),
        new Game('Outward', 'Outward',
            'Outward', 'Outward.exe', 'Outward_Data',
            'https://outward.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "794260"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Viola"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "Outward.jpg", GameSelectionDisplayMode.VISIBLE)
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

    // Return RiskOfRain2 game as base startup to be used for settings load.
    public static unsetGame(): Game {
        return this._gameList.find(value => value.internalFolderName === "RiskOfRain2")!;
    }
}
