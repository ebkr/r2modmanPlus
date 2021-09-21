import Game from '../../model/game/Game';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { StorePlatform } from '../../model/game/StorePlatform';
import { GameSelectionDisplayMode } from '../../model/game/GameSelectionDisplayMode';
import { GameInstanceType } from '../../model/game/GameInstanceType';
import { PackageLoader } from '../../model/installing/PackageLoader';
import * as path from 'path';

export default class GameManager {

    private static _activeGame: Game;

    private static _gameList = [
        new Game('Risk of Rain 2', 'RiskOfRain2', 'RiskOfRain2',
            'Risk of Rain 2', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "632360")], "RiskOfRain2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Thunderstore Dev', 'ThunderstoreDev', 'ThunderstoreBeta',
            'Risk of Rain 2', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.dev/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "632360")], "ThunderstoreBeta.jpg",
            GameSelectionDisplayMode.HIDDEN, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Risk of Rain 2 Dedicated Server', 'RiskOfRain2', 'RiskOfRain2Server',
            'Risk of Rain 2 Dedicated Server', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "1180760")], "RiskOfRain2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.SERVER, PackageLoader.BEPINEX),

        new Game('Dyson Sphere Program', 'DysonSphereProgram', 'DysonSphereProgram',
            'Dyson Sphere Program', ['DSPGAME.exe'], 'DSPGAME_Data',
            'https://dsp.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "1366540")], "DysonSphereProgram.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Valheim', 'Valheim', 'Valheim',
            'Valheim', ['valheim.exe', 'valheim.x86_64'], 'valheim_Data',
            'https://valheim.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "892970")], "Valheim.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Valheim Dedicated Server', 'Valheim', 'ValheimServer',
            'Valheim dedicated server', ['valheim_server.exe', 'valheim_server.x86_64'], 'valheim_server_Data',
            'https://valheim.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "896660")], "Valheim.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.SERVER, PackageLoader.BEPINEX),

        new Game('GTFO', 'GTFO', 'GTFO',
            'GTFO', ['GTFO.exe'], 'GTFO_Data',
            'https://gtfo.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "493520")], "GTFO.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Outward', 'Outward', 'Outward',
            'Outward', ['Outward.exe'], 'Outward_Data',
            'https://outward.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "794260"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Viola"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "Outward.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('TaleSpire', 'TaleSpire', 'TaleSpire',
            'TaleSpire', ['TaleSpire.exe'], 'TaleSpire_Data',
            'https://talespire.thunderstore.io/api/v1/package/', 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md',
            [new StorePlatformMetadata(StorePlatform.STEAM, "720620")], "TaleSpire.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("H3VR", "H3VR", "H3VR",
            "H3VR", ["h3vr.exe"], "h3vr_Data",
            "https://h3vr.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "450540")], "H3VR.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("ROUNDS", "ROUNDS", "ROUNDS",
            "ROUNDS", ["Rounds.exe"], "Rounds_Data",
            "https://rounds.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "1557740")], "ROUNDS.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Mechanica", "Mechanica", "Mechanica",
            "Mechanica", ["Mechanica.exe"], "Mechanica_Data",
            "https://mechanica.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "1226990")], "Mechanica.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Muck", "Muck", "Muck",
            "Muck", ["Muck.exe", "Muck.x86_64"], "Muck_Data",
            "https://muck.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "1625450")], "Muck.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("BONEWORKS", "BONEWORKS", "BONEWORKS",
            path.join("BONEWORKS", "BONEWORKS"), ["BONEWORKS.exe", "Boneworks_Oculus_Windows64.exe"], "BONEWORKS_Data",
            "https://boneworks.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "823500"), new StorePlatformMetadata(StorePlatform.OCULUS_STORE)], "BONEWORKS.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER),

        new Game("Lethal League Blaze", "LethalLeagueBlaze", "LethalLeagueBlaze",
            "LLBlaze", ["LLBlaze.exe", "LLBlaze.x86_64", "LLBlaze.x86"], "LLBlaze_Data",
            "https://lethal-league-blaze.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "553310")], "LethalLeagueBlaze.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Timerborn", "Timberborn", "Timberborn",
            "Timberborn", ["Timerborn.exe"], "Timberborn_Data",
            "https://timberborn.thunderstore.io/api/v1/package/", "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
            [new StorePlatformMetadata(StorePlatform.STEAM, "1062090")], "Timberborn.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

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
