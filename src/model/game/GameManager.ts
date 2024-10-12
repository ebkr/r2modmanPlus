import Game from '../../model/game/Game';
import StorePlatformMetadata from '../../model/game/StorePlatformMetadata';
import { StorePlatform } from '../../model/game/StorePlatform';
import { GameSelectionDisplayMode } from '../../model/game/GameSelectionDisplayMode';
import { GameInstanceType } from '../../model/game/GameInstanceType';
import { PackageLoader } from '../../model/installing/PackageLoader';
import PathResolver from '../../r2mm/manager/PathResolver';
import FileUtils from '../../utils/FileUtils';
import * as path from 'path';


const EXCLUSIONS = 'https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md';

export default class GameManager {

    private static _activeGame: Game;

    private static _gameList = [
        new Game('Risk of Rain 2', 'RiskOfRain2', 'RiskOfRain2',
            'Risk of Rain 2', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.io/c/riskofrain2/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "632360"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "4b3dcc5723454a47a9112d8fe8fd5f5c"),
            ], "RiskOfRain2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ROR2"]),

        new Game('Thunderstore Dev', 'ThunderstoreDev', 'ThunderstoreBeta',
            'Risk of Rain 2', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.dev/c/riskofrain2/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "632360")], "ThunderstoreBeta.jpg",
            GameSelectionDisplayMode.HIDDEN, GameInstanceType.GAME, PackageLoader.BEPINEX, ["TS Dev"]),

        new Game('Risk of Rain 2 Dedicated Server', 'RiskOfRain2', 'RiskOfRain2Server',
            'Risk of Rain 2 Dedicated Server', ['Risk of Rain 2.exe'], 'Risk of Rain 2_Data',
            'https://thunderstore.io/c/riskofrain2/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1180760")], "RiskOfRain2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.SERVER, PackageLoader.BEPINEX, ["ROR2"]),

        new Game('Dyson Sphere Program', 'DysonSphereProgram', 'DysonSphereProgram',
            'Dyson Sphere Program', ['DSPGAME.exe'], 'DSPGAME_Data',
            'https://thunderstore.io/c/dyson-sphere-program/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1366540"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "GameraGame.DysonSphereProgram")
            ], "DysonSphereProgram.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["DSP"]),

        new Game('Valheim', 'Valheim', 'Valheim',
            'Valheim', ['valheim.exe', 'valheim.x86_64'], 'valheim_Data',
            'https://thunderstore.io/c/valheim/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "892970"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "CoffeeStainStudios.Valheim")
            ], "Valheim.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Valheim Dedicated Server', 'Valheim', 'ValheimServer',
            'Valheim dedicated server', ['valheim_server.exe', 'valheim_server.x86_64'], 'valheim_server_Data',
            'https://thunderstore.io/c/valheim/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "896660")
            ], "Valheim.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.SERVER, PackageLoader.BEPINEX),

        new Game('GTFO', 'GTFO', 'GTFO',
            'GTFO', ['GTFO.exe'], 'GTFO_Data',
            'https://thunderstore.io/c/gtfo/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "493520")], "GTFO.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Outward', 'Outward', 'Outward',
            'Outward', ['Outward.exe'], 'Outward_Data',
            'https://thunderstore.io/c/outward/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "794260"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Viola"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "Outward.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Outward Definitive', 'OutwardDe', 'OutwardDe',
            'Outward/Outward_Defed', ['Outward Definitive Edition.exe'], 'Outward Definitive Edition_Data',
            'https://thunderstore.io/c/outward/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1758860"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "f07a51af8ac845ea96f792fb485e04a3"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "OutwardDe.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('TaleSpire', 'TaleSpire', 'TaleSpire',
            'TaleSpire', ['TaleSpire.exe'], 'TaleSpire_Data',
            'https://thunderstore.io/c/talespire/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "720620")], "TaleSpire.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["TS"]),

        new Game("H3VR", "H3VR", "H3VR",
            "H3VR", ["h3vr.exe"], "h3vr_Data",
            "https://thunderstore.io/c/h3vr/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "450540")], "H3VR.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["Hot Dogs, Horseshoes & Hand Grenades", "Hot Dogs, Horseshoes and Hand Grenades"]),

        new Game("ROUNDS", "ROUNDS", "ROUNDS",
            "ROUNDS", ["Rounds.exe"], "Rounds_Data",
            "https://thunderstore.io/c/rounds/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1557740")], "ROUNDS.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Mechanica", "Mechanica", "Mechanica",
            "Mechanica", ["Mechanica.exe"], "Mechanica_Data",
            "https://thunderstore.io/c/mechanica/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1226990")], "Mechanica.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Muck", "Muck", "Muck",
            "Muck", ["Muck.exe", "Muck.x86_64"], "Muck_Data",
            "https://thunderstore.io/c/muck/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1625450")], "Muck.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("BONEWORKS", "BONEWORKS", "BONEWORKS",
            path.join("BONEWORKS", "BONEWORKS"), ["BONEWORKS.exe", "Boneworks_Oculus_Windows64.exe"], "BONEWORKS_Data",
            "https://thunderstore.io/c/boneworks/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "823500"), new StorePlatformMetadata(StorePlatform.OCULUS_STORE)], "BONEWORKS.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, ["BW"]),

        new Game("Lethal League Blaze", "LethalLeagueBlaze", "LethalLeagueBlaze",
            "LLBlaze", ["LLBlaze.exe", "LLBlaze.x86_64", "LLBlaze.x86", "LLBlaze.app"], "LLBlaze_Data",
            "https://thunderstore.io/c/lethal-league-blaze/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "553310")], "LethalLeagueBlaze.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["LLB"]),

        new Game("Timberborn", "Timberborn", "Timberborn",
            "Timberborn", ["Timberborn.exe"], "Timberborn_Data",
            "https://thunderstore.io/c/timberborn/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1062090"), new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "972a4ca2631e43b4ba7bc3b7586ad8c4"), new StorePlatformMetadata(StorePlatform.OTHER)], "Timberborn.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["TB"]),

        new Game("TABS", "TABS", "TotallyAccurateBattleSimulator",
            "Totally Accurate Battle Simulator", ["TotallyAccurateBattleSimulator.exe"], "TotallyAccurateBattleSimulator_Data",
            "https://thunderstore.io/c/totally-accurate-battle-simulator/api/v1/package-listing-index/", EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "508440"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Driftfish"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "LandfallGames.TotallyAccurateBattleSimulator")
            ], "TotallyAccurateBattleSimulator.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["Totally Accurate Battle Simulator"]),

        new Game("Nickelodeon All‑Star Brawl", "NASB", "NASB",
            "Nickelodeon All-Star Brawl", ["Nickelodeon All-Star Brawl.exe"], "Nickelodeon All-Star Brawl_Data",
            "https://thunderstore.io/c/nasb/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1414850")], "NASB.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["Nickelodeon All-Star Brawl", "NASB"]),

        new Game("Inscryption", "Inscryption", "Inscryption",
            "Inscryption", ["Inscryption.exe"], "Inscryption_Data",
            "https://thunderstore.io/c/inscryption/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1092790"), new StorePlatformMetadata(StorePlatform.OTHER)], "Inscryption.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game("Starsand", "Starsand", "Starsand",
            "Starsand", ["Starsand.exe"], "Starsand_Data",
            "https://thunderstore.io/c/starsand/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1380220"), new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "a774278c0813447c96a76b053cbf73ff")], "Starsand.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX),

        new Game('Cats are Liquid - A Better Place', 'CatsAreLiquidABP', 'CatsAreLiquidABP',
            'Cats are Liquid - A Better Place', ['CaL-ABP-Windows.exe', "CaL-ABP-Linux.x86_64", 'CaL-ABP-macOS.app'], 'CaL-ABP-Windows_Data',
            'https://thunderstore.io/c/cats-are-liquid/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1188080"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "CatsAreLiquidABP.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX,
            ['calabp', 'cal', 'abp']),


        new Game('Potion Craft', 'PotionCraft', 'PotionCraft',
            'Potion Craft', ['Potion Craft.exe'], 'Potion Craft_Data',
            'https://thunderstore.io/c/potion-craft/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1210320")], 'PotionCraft.jpg',
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX,
            ['pc']),

        new Game('Nearly Dead', 'NearlyDead', 'NearlyDead',
            'Nearly Dead', ['Nearly Dead.exe'], 'Nearly Dead_Data',
            'https://thunderstore.io/c/nearly-dead/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1268900")], 'NearlyDead.png',
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX,
            ['nd']),

        new Game('AGAINST', 'AGAINST', 'AGAINST',
            'AGAINST_steam', ['AGAINST.exe'], "AGAINST_Data",
            'https://thunderstore.io/c/against/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1584840")], "AGAINST.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game('Rogue Tower', 'RogueTower', 'RogueTower',
            'Rogue Tower', ['Rogue Tower.exe'], "Rogue Tower_Data",
            'https://thunderstore.io/c/rogue-tower/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1843760")], "RogueTower.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ['rt']),

        new Game('House of the Dying Sun', 'HOTDS', 'HOTDS',
            'DyingSun', ['dyingsun.exe'], 'dyingsun_Data',
            'https://thunderstore.io/c/hotds/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, '283160')], "HOTDS.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ['hotds']),

        new Game('For The King', 'ForTheKing', 'ForTheKing',
            'For The King', ['FTK.exe'], 'FTK_Data',
            'https://thunderstore.io/c/for-the-king/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "527230"), new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Discus")], "ForTheKing.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ftk"]),

        new Game('Subnautica', 'Subnautica', 'Subnautica',
            'Subnautica', ['Subnautica.exe'], 'Subnautica_Data',
            'https://thunderstore.io/c/subnautica/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "264710"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Jaguar"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "UnknownWorldsEntertainmen.GAMEPREVIEWSubnautica"),
            ], "Subnautica.png", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game('Subnautica: Below Zero', 'SubnauticaBZ', 'SubnauticaBZ',
            'SubnauticaZero', ['SubnauticaZero.exe'], 'SubnauticaZero_Data',
            'https://thunderstore.io/c/subnautica-below-zero/api/v1/package-listing-index/', EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, '848450'),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "UnknownWorldsEntertainmen.SubnauticaBelowZero"),
            ], 'SubnauticaBelowZero.png', GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["bz", "sbz", "s:bz"]),

        new Game("Core Keeper", "CoreKeeper", "CoreKeeper",
            "Core Keeper", ["CoreKeeper.exe"], "CoreKeeper_Data",
            'https://thunderstore.io/c/core-keeper/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1621690")], "CoreKeeper.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ck"]),

        new Game("Titanfall 2", "Titanfall2", "Titanfall2",
            "Titanfall2", ["NorthstarLauncher.exe", "Titanfall2.exe"], "",
            'https://thunderstore.io/c/northstar/api/v1/package-listing-index/', EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM_DIRECT, "1237970"), new StorePlatformMetadata(StorePlatform.ORIGIN, "")], "Titanfall2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.NORTHSTAR, ["northstar", "ns", "tf2", "tf|2"]),

        new Game("Peglin", "Peglin", "Peglin",
            "Peglin", ["Peglin.exe"], "Peglin_Data",
            "https://thunderstore.io/c/peglin/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1296610"), new StorePlatformMetadata(StorePlatform.OTHER)], "Peglin.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("V Rising", "VRising", "VRising",
            "VRising", ["VRising.exe"], "VRising_Data",
            "https://thunderstore.io/c/v-rising/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1604030")], "VRising.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["vrising"]),

        new Game("Hard Bullet", "HardBullet", "HardBullet",
            "Hard Bullet", ["Hard Bullet.exe"], "Hard Bullet_Data",
            "https://thunderstore.io/c/hard-bullet/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1294760")], "HardBullet.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, ["hb"]),

        new Game("20 Minutes Till Dawn", "20MinutesTillDawn", "20MinutesTillDawn",
            "20MinuteTillDawn", ["MinutesTillDawn.exe"], "MinutesTillDawn_Data",
            "https://thunderstore.io/c/20-minutes-till-dawn/api/v1/package-listing-index/", EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1966900"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "4656facc740742a39e265b026e13d075")
            ], "20MinutesTillDawn.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["mtd", "20mtd"]),

        new Game("Green Hell VR", "GreenHellVR", "GreenHellVR",
            "Green Hell VR", ["GHVR.exe"], "GHVR_Data",
            "https://thunderstore.io/c/green-hell-vr/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1782330"), new StorePlatformMetadata(StorePlatform.OCULUS_STORE)], "GreenHellVR.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ghvr"]),

        new Game("VTOL VR", "VTOL_VR", "VTOL_VR",
            "VTOL VR", ["VTOLVR.exe"], "VTOLVR_Data",
            "https://thunderstore.io/c/vtol-vr/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "667970")], "VtolVR.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Backpack Hero", "BackpackHero", "BackpackHero",
            "Backpack Hero", ["Backpack Hero.exe", "linux.x86_64"], "Backpack Hero_Data",
            "https://thunderstore.io/c/backpack-hero/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1970580")], "BackpackHero.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, ["bh", "farlands"]),

        new Game("Stacklands", "Stacklands", "Stacklands",
            "Stacklands", ["Stacklands.exe"], "Stacklands_Data",
            "https://thunderstore.io/c/stacklands/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1948280")], "Stacklands.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Enter the Gungeon", "ETG", "EnterTheGungeon",
            "Enter the Gungeon", ["EtG.exe"], "EtG_Data",
            "https://thunderstore.io/c/enter-the-gungeon/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "311690"), new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "Garlic"), new StorePlatformMetadata(StorePlatform.OTHER)], "EnterTheGungeon.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["etg"]),

        new Game("Ravenfield", "Ravenfield", "Ravenfield",
            "Ravenfield", ["ravenfield.exe"], "ravenfield_Data",
            "https://thunderstore.io/c/ravenfield/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "636480")], "Ravenfield.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["rf"]),

        new Game("Aloft", "Aloft", "Aloft",
            "Aloft Demo", ["Aloft.exe"], "Aloft_Data",
            "https://thunderstore.io/c/aloft/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2051980")], "Aloft.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Cult of the Lamb", "COTL", "COTL",
            "Cult of the Lamb", ["Cult Of The Lamb.exe"], "Cult Of The Lamb_Data",
            "https://thunderstore.io/c/cult-of-the-lamb/api/v1/package-listing-index/", EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1313140"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ], "Cotl.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["cotl"]),

        new Game("Chrono Ark", "ChronoArk", "ChronoArk",
            path.join("Chrono Ark", "x64", "Master"), ["ChronoArk.exe"], "ChronoArk_Data",
            "https://thunderstore.io/c/chrono-ark/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1188930")], "ChronoArk.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("BONELAB", "BONELAB", "BONELAB",
            "BONELAB", ["BONELAB_Steam_Windows64.exe", "BONELAB_Oculus_Windows64.exe"], "BONELAB_Steam_Windows64",
            "https://thunderstore.io/c/bonelab/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1592190"), new StorePlatformMetadata(StorePlatform.OCULUS_STORE)], "BONELAB.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, ["BL"]),

        new Game("Trombone Champ", "TromboneChamp", "TromboneChamp",
            "TromboneChamp", ["TromboneChamp.exe"], "TromboneChamp_Data",
            "https://thunderstore.io/c/trombone-champ/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1059990")], "TromboneChamp.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["tc"]),

        new Game("Rogue : Genesia", "RogueGenesia", "RogueGenesia",
            "Rogue Genesia", ["Rogue Genesia.exe"], "Rogue Genesia_Data",
            "https://thunderstore.io/c/rogue-genesia/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2067920")], "RogueGenesia.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["rg"]),

        new Game("Across the Obelisk", "AcrossTheObelisk", "AcrossTheObelisk",
            "Across the Obelisk", ["AcrossTheObelisk.exe"], "AcrossTheObelisk_Data",
            "https://thunderstore.io/c/across-the-obelisk/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1385380")], "AcrossTheObelisk.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ato", "ao"]),

        new Game("ULTRAKILL", "ULTRAKILL", "ULTRAKILL",
            "ULTRAKILL", ["ULTRAKILL.exe"], "ULTRAKILL_Data",
            "https://thunderstore.io/c/ultrakill/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1229490")], "ULTRAKILL.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["uk"]),

        new Game("Ultimate Chicken Horse", "UltimateChickenHorse", "UltimateChickenHorse",
            "Ultimate Chicken Horse", ["UltimateChickenHorse.exe"], "UltimateChickenHorse_Data",
            "https://thunderstore.io/c/ultimate-chicken-horse/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "386940")], "ultimate-chicken-horse.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["uch"]),

        new Game("Atrio: The Dark Wild", "AtrioTheDarkWild", "AtrioTheDarkWild",
            "Atrio The Dark Wild", ["Atrio.exe"], "Atrio_Data",
            "https://thunderstore.io/c/atrio-the-dark-wild/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1125390")], "atrio-the-dark-wild.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["adw"]),

        new Game("Brotato", "Brotato", "Brotato",
            "Brotato", ["Brotato.exe"], "",
            "https://thunderstore.io/c/brotato/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1942280")], "brotato.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.GODOT_ML, []),

        new Game("Ancient Dungeon VR", "AncientDungeonVR", "AncientDungeonVR",
            "Ancient Dungeon VR", ["Ancient_Dungeon.exe"], "Ancient_Dungeon_Data",
            "https://thunderstore.io/c/ancient-dungeon-vr/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1125240"), new StorePlatformMetadata(StorePlatform.OCULUS_STORE)], "ancient-dungeon-vr.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.ANCIENT_DUNGEON_VR, ["adv"]),

        new Game("RUMBLE", "RUMBLE", "RUMBLE",
            "RUMBLE", ["RUMBLE.exe"], "RUMBLE_Data",
            "https://thunderstore.io/c/rumble/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "890550")], "RUMBLE.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, []),

        new Game("Dome Keeper", "DomeKeeper", "DomeKeeper",
            "Dome Keeper", ["domekeeper.exe"], "",
            "https://thunderstore.io/c/dome-keeper/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1637320")], "dome-keeper.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.GODOT_ML, ["dk"]),

        new Game("Skul: The Hero Slayer", "SkulTheHeroSlayer", "SkulTheHeroSlayer",
            "Skul", ["Skul.exe"], "Skul_Data",
            "https://thunderstore.io/c/skul-the-hero-slayer/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1147560")], "skul-the-hero-slayer.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Sons Of The Forest", "SonsOfTheForest", "SonsOfTheForest",
            "Sons Of The Forest", ["SonsOfTheForest.exe"], "SonsOfTheForest_Data",
            "https://thunderstore.io/c/sons-of-the-forest/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1326470")], "sons-of-the-forest.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["sotf"]),

        new Game("The Ouroboros King", "TheOuroborosKing", "TheOuroborosKing",
            "The Ouroboros King", ["The Ouroboros King.exe"], "The Ouroboros King_Data",
            "https://thunderstore.io/c/the-ouroboros-king/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2096510")], "the-ouroboros-king.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["tok"]),

        new Game("Wrestling Empire", "WrestlingEmpire", "WrestlingEmpire",
            "Wrestling Empire", ["Wrestling Empire.exe"], "Wrestling Empire_Data",
            "https://thunderstore.io/c/wrestling-empire/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1620340")], "wrestling-empire.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["we"]),

        new Game("Receiver 2", "Receiver2", "Receiver2",
            "Receiver 2", ["Receiver2.exe"], "Receiver2_Data",
            "https://thunderstore.io/c/receiver-2/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1129310")], "receiver-2.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["rec2"]),

        new Game("The Planet Crafter", "ThePlanetCrafter", "ThePlanetCrafter",
            "The Planet Crafter", ["Planet Crafter.exe"], "ThePlanetCrafter_Data",
            "https://thunderstore.io/c/the-planet-crafter/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1284190")], "the-planet-crafter.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["tpc"]),

        new Game("Patch Quest", "PatchQuest", "PatchQuest",
            "Patch Quest", ["Patch Quest.exe"], "PatchQuest_Data",
            "https://thunderstore.io/c/patch-quest/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1347970")], "patch-quest.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.MELON_LOADER, ["pq"]),

        new Game("Shadows Over Loathing", "ShadowsOverLoathing", "ShadowsOverLoathing",
            path.join("Shadows Over Loathing", "Shadows Over Loathing"), ["Shadows Over Loathing.exe"], "ShadowsOverLoathing_Data",
            "https://thunderstore.io/c/shadows-over-loathing/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1939160")], "shadows-over-loathing.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["sol"]),

        new Game("West of Loathing", "WestofLoathing", "WestofLoathing",
            "West of Loathing", ["West of Loathing.exe"], "WestofLoathing_Data",
            "https://thunderstore.io/c/west-of-loathing/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "597220")], "west-of-loathing.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["wol"]),

        new Game("Sun Haven", "SunHaven", "SunHaven",
            "Sun Haven", ["Sun Haven.exe"], "SunHaven_Data",
            "https://thunderstore.io/c/sun-haven/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1432860")], "sun-haven.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["sh"]),

        new Game("Wildfrost", "Wildfrost", "Wildfrost",
            "Wildfrost", ["Wildfrost.exe"], "Wildfrost_Data",
            "https://thunderstore.io/c/wildfrost/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1811990")], "wildfrost.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["wfrst"]),

        new Game("Shadows of Doubt", "ShadowsofDoubt", "ShadowsofDoubt",
            "Shadows of Doubt", ["Shadows of Doubt.exe"], "ShadowsofDoubt_Data",
            "https://thunderstore.io/c/shadows-of-doubt/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "986130")], "shadows-of-doubt.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["sod"]),

        new Game("Garfield Kart - Furious Racing", "GarfieldKartFuriousRacing", "GarfieldKartFuriousRacing",
            "Garfield Kart - Furious Racing", ["Garfield Kart Furious Racing.exe"], "GarfieldKartFuriousRacing_Data",
            "https://thunderstore.io/c/garfield-kart-furious-racing/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1085510")], "garfield-kart-furious-racing.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["gkfr"]),

        new Game("Techtonica", "Techtonica", "Techtonica",
            "Techtonica", ["Techtonica.exe"], "Techtonica_Data",
            "https://thunderstore.io/c/techtonica/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1457320")], "techtonica.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["tt"]),

        new Game("Thronefall", "Thronefall", "Thronefall",
            "Thronefall", ["Thronefall.exe"], "Thronefall_Data",
            "https://thunderstore.io/c/thronefall/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2239150")], "thronefall.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["tf"]),

        new Game("We Love Katamari REROLL+ Royal Reverie", "WeLoveKatamariRerollRoyalReverie", "WeLoveKatamariRerollRoyalReverie",
            "WLKRR", ["WLKRR.exe"], "WeLoveKatamariRerollRoyalReverie_Data",
            "https://thunderstore.io/c/we-love-katamari-reroll-royal-reverie/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1730700")], "WLKRR.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["wlkrr"]),

        new Game("Wizard of Legend", "WizardOfLegend", "WizardOfLegend",
            "Wizard of Legend", ["WizardOfLegend.exe"], "WizardOfLegend_Data",
            "https://thunderstore.io/c/wizard-of-legend/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "445980")], "WizardOfLegend.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["wol"]),

        new Game(
            "Bomb Rush Cyberfunk", "BombRushCyberfunk", "BombRushCyberfunk",
            "BombRushCyberfunk", ["Bomb Rush Cyberfunk.exe"], "Bomb Rush Cyberfunk_Data",
            "https://thunderstore.io/c/bomb-rush-cyberfunk/api/v1/package-listing-index/", EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "1353230"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "TeamReptile.BombRushCyberfunk")
            ], "BombRushCyberfunk.jpg", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["brc"]),

        new Game(
            "TouhouLostBranchOfLegend", "TouhouLostBranchOfLegend", "TouhouLostBranchOfLegend",
            "LBoL", ["LBoL.exe"], "LBoL_Data",
            "https://thunderstore.io/c/touhou-lost-branch-of-legend/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1140150")], "TouhouLostBranchOfLegend.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["lbol"]),

         new Game("Wizard With A Gun", "WizardWithAGun", "WizardWithAGun",
            "Wizard With A Gun", ['wizardwithagun.exe'], "wizardwithagun_Data",
            "https://thunderstore.io/c/wizard-with-a-gun/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1150530")], "WizardWithAGun.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["wizgun"]),

        new Game("Sunkenland", "Sunkenland", "Sunkenland",
            "Sunkenland", ["Sunkenland.exe"], "Sunkenland_Data",
            "https://thunderstore.io/c/sunkenland/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2080690")], "Sunkenland.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Atomicrops", "Atomicrops", "Atomicrops",
            "Atomicrops", ["Atomicrops.exe"], "Atomicrops_Data",
            "https://thunderstore.io/c/atomicrops/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "757320")], "Atomicrops.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ac"]),

        new Game("Erenshor", "Erenshor", "Erenshor",
            "Erenshor", ["Erenshor.exe"], "Erenshor_Data",
            "https://thunderstore.io/c/erenshor/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2382520")], "Erenshor.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Last Train Outta' Wormtown", "LastTrainOuttaWormtown", "LastTrainOuttaWormtown",
            "Last Train Outta' Wormtown", ["Last Train Out Of WormTown.exe"], "Last Train Out Of WormTown_Data",
            "https://thunderstore.io/c/last-train-outta-wormtown/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2318480")], "LastTrainOuttaWormtown.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ltow"]),

        new Game("DREDGE", "Dredge", "Dredge",
            "DREDGE", ["DREDGE.exe"], "DREDGE_Data",
            "https://thunderstore.io/c/dredge/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1562430")], "Dredge.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Cities: Skylines II", "CitiesSkylines2", "CitiesSkylines2",
            "Cities Skylines II", ["Cities2.exe"], "CitiesSkylines2_Data",
            "https://thunderstore.io/c/cities-skylines-ii/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "949230"), new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "ParadoxInteractive.CitiesSkylinesII-PCEdition")], "CitiesSkylines2.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["cs2"]),

        new Game("Lethal Company", "LethalCompany", "LethalCompany",
            "Lethal Company", ["Lethal Company.exe"], "Lethal Company_Data",
            "https://thunderstore.io/c/lethal-company/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1966720")], "LethalCompany.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["lc"]),

        new Game("Meeple Station", "MeepleStation", "MeepleStation",
            "Meeple Station", ["Meeple Station.exe"], "MeepleStation_Data",
            "https://thunderstore.io/c/meeple-station/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "900010")], "MeepleStation.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ms"]),

        new Game("Void Crew", "VoidCrew", "VoidCrew",
            "Void Crew", ["Void Crew.exe"], "VoidCrew_Data",
            "https://thunderstore.io/c/void-crew/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1063420")], "VoidCrew.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["vc"]),

        new Game("Sailwind", "Sailwind", "Sailwind",
            "Sailwind", ["Sailwind.exe"], "Sailwind_Data",
            "https://thunderstore.io/c/sailwind/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1764530")], "Sailwind.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game(
            "Voices of the Void", "VotV", "VotV",
            "", ["VotV.exe"], "VotV",
            "https://thunderstore.io/c/voices-of-the-void/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.OTHER)], "VotV.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.SHIMLOADER, ["votv"]),

        new Game(
            "Palworld", "Palworld", "Palworld",
            "Palworld", ["Palworld.exe"], "Pal",
            "https://thunderstore.io/c/palworld/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1623730")], "Palworld.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.SHIMLOADER, ["palworld"]),

        new Game("Plasma", "Plasma", "Plasma",
            "Plasma", ["Plasma.exe"], "Plasma_Data",
            "https://thunderstore.io/c/plasma/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1409160")], "Plasma.jpg",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

            new Game("Content Warning", "ContentWarning", "ContentWarning",
            "Content Warning", ["Content Warning.exe"], "Content Warning_Data",
            "https://thunderstore.io/c/content-warning/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2881650")], "ContentWarning.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["cw"]),

        new Game("Balatro", "Balatro", "Balatro",
            "Balatro", ["Balatro.exe"], "Balatro_Data",
            "https://thunderstore.io/c/balatro/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2379780")], "Balatro.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.LOVELY, []),

        new Game(
            "Bopl Battle", "BoplBattle", "BoplBattle",
            "Bopl Battle", ["BoplBattle.exe"], "BoplBattle_Data",
            "https://thunderstore.io/c/bopl-battle/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1686940")], "BoplBattle.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["bb"]),

        new Game("Vertigo 2", "Vertigo2", "Vertigo2",
            "Vertigo 2", ["vertigo2.exe"], "vertigo2_Data",
            "https://thunderstore.io/c/vertigo-2/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "843390")], "Vertigo2.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Against the Storm", "AgainstTheStorm", "AgainstTheStorm",
            "Against the Storm", ["Against the Storm.exe"], "Against the Storm_Data",
            "https://thunderstore.io/c/against-the-storm/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1336490")], "AgainstTheStorm.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["ats"]),

        new Game("Lycans", "Lycans", "Lycans",
            "Lycans", ["Lycans.exe"], "Lycans_Data",
            "https://thunderstore.io/c/lycans/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2596100")], "Lycans.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Castle Story", "CastleStory", "CastleStory",
            "Castle Story", ["Castle Story.exe"], "Castle Story_Data",
            "https://thunderstore.io/c/castle-story/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM_DIRECT, "227860")], "CastleStory.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["cs"]),

        new Game(
            "Panicore", "Panicore", "Panicore",
            "Panicore", ["Panicore.exe"], "Panicore",
            "https://thunderstore.io/c/panicore/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2695940")], "Panicore.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.SHIMLOADER, ["panicore"]),

        new Game("Risk of Rain Returns", "RiskofRainReturns", "RiskofRainReturns",
            "Risk of Rain Returns", ["Risk of Rain Returns.exe"], "",
            "https://thunderstore.io/c/risk-of-rain-returns/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1337520")], "RiskOfRainReturns.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.RETURN_OF_MODDING, ["rorr"]),

        new Game("Magicraft", "Magicraft", "Magicraft",
            "Magicraft", ["Magicraft.exe"], "Magicraft_Data",
            "https://thunderstore.io/c/magicraft/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2103140")], "Magicraft.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, []),

        new Game("Another Crab's Treasure", "AnotherCrabsTreasure", "AnotherCrabsTreasure",
            "AnotherCrabsTreasure", ["AnotherCrabsTreasure.exe"], "AnotherCrabsTreasure_Data",
            "https://thunderstore.io/c/another-crabs-treasure/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1887840")], "AnotherCrabsTreasure.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["act"]),

        new Game("Gladio Mori", "GladioMori", "GladioMori",
            "Gladio Mori Demo", ["Gladio Mori.exe"], "Gladio Mori_Data",
            "https://thunderstore.io/c/gladio-mori/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2908480")], "GladioMori.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["gm"]),

        new Game("Slipstream: Rogue Space", "SlipstreamRogueSpace", "SlipstreamRogueSpace",
            "Slipstream Rogue Space", ["Slipstream_Win.exe"], "Slipstream_Win_Data",
            "https://thunderstore.io/c/slipstream-rogue-space/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2765860")], "SlipstreamRogueSpace.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["srs"]),

        new Game("Back to the Dawn", "BacktotheDawn", "BacktotheDawn",
            "MetalHeadGames", ["Back To The Dawn.exe"], "Back To The Dawn_Data",
            "https://thunderstore.io/c/back-to-the-dawn/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1735700")], "BackToTheDawn.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["bttd"]),

        new Game("Below the Stone", "BelowTheStone", "BelowTheStone",
            "Below The Stone", ["Below The Stone.exe"], "Below The Stone_Data",
            "https://thunderstore.io/c/below-the-stone/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1170230")], "BelowTheStone.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["bts"]),

        new Game("Gloomwood", "Gloomwood", "Gloomwood",
            "Gloomwood", ["Gloomwood.exe"], "Gloomwood_Data",
            "https://thunderstore.io/c/gloomwood/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1150760")], "Gloomwood.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["gw"]),

        new Game("Among Us", "AmongUs", "AmongUs",
            "Among Us", ["Among Us.exe"], "Among Us_Data",
            "https://thunderstore.io/c/among-us/api/v1/package-listing-index/", EXCLUSIONS,
            [
                new StorePlatformMetadata(StorePlatform.STEAM, "945360"),
                new StorePlatformMetadata(StorePlatform.EPIC_GAMES_STORE, "among-us"),
                new StorePlatformMetadata(StorePlatform.XBOX_GAME_PASS, "Innersloth.AmongUs"),
                new StorePlatformMetadata(StorePlatform.OTHER)
            ],
            "AmongUs.png", GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, ["au"]),

        new Game("Betrayal Beach", "BetrayalBeach", "BetrayalBeach",
            "Betrayal Beach", ["Betrayal Beach.exe"], "Betrayal Beach_Data",
            "https://thunderstore.io/c/betrayal-beach/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2643810")], "BetrayalBeach.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Arcus Chroma", "ArcusChroma", "ArcusChroma",
            "Arcus Chroma", ["Arcus Chroma.exe"], "Arcus Chroma_Data",
            "https://thunderstore.io/c/arcus-chroma/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1447350")], "ArcusChroma.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Deep Rock Galactic: Survivor", "DeepRockGalacticSurvivor", "DeepRockGalacticSurvivor",
            "Deep Rock Survivor", ["DRG Survivor.exe"], "DRG Survivor_Data",
            "https://thunderstore.io/c/deep-rock-galactic-survivor/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2321470")], "DeepRockGalacticSurvivor.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Ale & Tale Tavern", "AleAndTaleTavern", "AleAndTaleTavern",
            "Ale & Tale Tavern", ["Ale and Tale Tavern.exe"], "Ale and Tale Tavern_Data",
            "https://thunderstore.io/c/ale-and-tale-tavern/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2683150")], "AleAndTaleTavern.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Screw Drivers", "ScrewDrivers", "ScrewDrivers",
            "Screw Drivers", ["Screw Drivers.exe"], "Screw Drivers_Data",
            "https://thunderstore.io/c/screw-drivers/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1279510")], "ScrewDrivers.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Nine Sols", "NineSols", "NineSols",
            "Nine Sols", ["NineSols.exe"], "Nine Sols_Data",
            "https://thunderstore.io/c/nine-sols/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1809540")], "NineSols.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Goodbye Volcano High", "GoodbyeVolcanoHigh", "GoodbyeVolcanoHigh",
            "Goodbye Volcano High", ["Goodbye Volcano High.exe"], "Goodbye Volcano High_Data",
            "https://thunderstore.io/c/goodbye-volcano-high/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1310330")], "GoodbyeVolcanoHigh.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Supermarket Together", "SupermarketTogether", "SupermarketTogether",
            "Supermarket Together", ["Supermarket Together.exe"], "Supermarket Together_Data",
            "https://thunderstore.io/c/supermarket-together/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2709570")], "SupermarketTogether.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Hades II", "HadesII", "HadesII",
            path.join("Hades II", "Ship"), ["Hades2.exe"], "",
            "https://thunderstore.io/c/hades-ii/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1145350")], "Hades2.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.RETURN_OF_MODDING, ["h2"]),

        new Game("Shapez 2", "Shapez2", "Shapez2",
            "shapez 2", ["shapez 2.exe"], "shapez 2_Data",
            "https://thunderstore.io/c/shapez-2/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2162800")], "Shapez2.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Paquerette Down the Bunburrows", "PaqueretteDownTheBunburrows", "PaqueretteDownTheBunburrows",
            "Paquerette Down the Bunburrows", ["Paquerette Down the Bunburrows.exe"], "Paquerette Down the Bunburrows_Data",
            "https://thunderstore.io/c/paquerette-down-the-bunburrows/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "1628610")], "PaqueretteDownTheBunburrows.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Hard Time III", "HardTime3", "HardTime3",
            "Hard Time III", ["Hard Time III.exe"], "Hard Time III_Data",
            "https://thunderstore.io/c/hard-time-3/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "3009850")], "HardTime3.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Tank Team", "TankTeam", "TankTeam",
            "Tank Team", ["Tank Team.exe"], "Tank Team_Data",
            "https://thunderstore.io/c/tank-team/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2587450")], "TankTeam.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Distance", "Distance", "Distance",
            "Distance", ["Distance.exe"], "Distance_Data",
            "https://thunderstore.io/c/distance/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "233610")], "Distance.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),

        new Game("Five Nights at Freddy's: Into the Pit", "FiveNightsAtFreddysIntoThePit", "FiveNightsAtFreddysIntoThePit",
            "Five Nights at Freddy's Into the Pit", ["Five Nights at Freddy's Into the Pit.exe"], "Five Nights at Freddy's Into the Pit_Data",
            "https://thunderstore.io/c/five-nights-at-freddys-into-the-pit/api/v1/package-listing-index/", EXCLUSIONS,
            [new StorePlatformMetadata(StorePlatform.STEAM, "2638370")], "FiveNightsAtFreddysIntoThePit.png",
            GameSelectionDisplayMode.VISIBLE, GameInstanceType.GAME, PackageLoader.BEPINEX, [""]),
    ];

    static get activeGame(): Game {
        return this._activeGame;
    }

    static set activeGame(game: Game) {
        this._activeGame = game;
    }

    // Used for loading game specific settings before game is selected.
    static get defaultGame(): Game {
        return this._gameList.find(value => value.internalFolderName === "RiskOfRain2")!;
    }

    static get gameList(): Game[] {
        return [...this._gameList];
    }

    public static async activate(game: Game, platform: StorePlatform) {
        this._activeGame = game;
        this._activeGame.setActivePlatformByStore(platform);
        PathResolver.MOD_ROOT = path.join(PathResolver.ROOT, game.internalFolderName);
        await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
    }

    public static findByFolderName(name?: string|null) {
        return name
            ? this._gameList.find((game) => game.internalFolderName === name)
            : undefined;
    }
}
