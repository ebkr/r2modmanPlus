import InstallationRules from '../InstallationRules';
import InstallRules_Valheim from '../default_installation_rules/game_rules/InstallRules_Valheim';
import InstallRules_GTFO from '../default_installation_rules/game_rules/InstallRules_GTFO';
import InstallRules_H3VR from '../default_installation_rules/game_rules/InstallRules_H3VR';
import InstallRules_BONEWORKS from '../default_installation_rules/game_rules/InstallRules_BONEWORKS';
import InstallRules_Timberborn from '../default_installation_rules/game_rules/InstallRules_Timberborn';
import InstallRules_ThunderstoreDev from '../default_installation_rules/game_rules/InstallRules_ThunderstoreDev';
import InstallRules_NASB from '../default_installation_rules/game_rules/InstallRules_NASB';
import InstallRules_Subnautica from '../default_installation_rules/game_rules/InstallRules_Subnautica';
import InstallRules_SubnauticaBZ from '../default_installation_rules/game_rules/InstallRules_SubnauticaBZ';
import InstallRules_Titanfall2 from '../default_installation_rules/game_rules/InstallRules_Titanfall2';
import InstallRules_BONELAB from '../default_installation_rules/game_rules/InstallRules_BONELAB';
import { buildBepInExRules } from '../default_installation_rules/game_rules/InstallRules_BepInex';
import * as path from 'path';
import { buildGodotMLRules } from "../default_installation_rules/game_rules/InstallRules_GodotML";
import {
    InstallRules_AncientDungeonVR
} from "../default_installation_rules/game_rules/InstallRules_AncientDungeonVR";
import {
    buildMelonLoaderRules
} from "../default_installation_rules/game_rules/InstallRules_MelonLoader";

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = [
            buildBepInExRules("RiskOfRain2"),
            InstallRules_ThunderstoreDev(),
            buildBepInExRules("DysonSphereProgram"),
            InstallRules_Valheim(),
            InstallRules_GTFO(),
            buildBepInExRules("Outward"),
            buildBepInExRules("OutwardDe"),
            buildBepInExRules("TaleSpire"),
            InstallRules_H3VR(),
            buildBepInExRules("ROUNDS"),
            buildBepInExRules("Mechanica"),
            buildBepInExRules("Muck"),
            InstallRules_BONEWORKS(),
            buildBepInExRules("LethalLeagueBlaze"),
            InstallRules_Timberborn(),
            buildBepInExRules("TABS"),
            InstallRules_NASB(),
            buildBepInExRules("Inscryption"),
            buildBepInExRules("Starsand"),
            buildBepInExRules("CatsAreLiquidABP"),
            buildBepInExRules("PotionCraft"),
            buildBepInExRules("NearlyDead"),
            buildBepInExRules("AGAINST"),
            buildBepInExRules("RogueTower"),
            buildBepInExRules("HOTDS"),
            buildBepInExRules("ForTheKing"),
            InstallRules_Subnautica(),
            InstallRules_SubnauticaBZ(),
            buildBepInExRules("CoreKeeper"),
            InstallRules_Titanfall2(),
            buildBepInExRules("Peglin"),
            buildBepInExRules("VRising"),
            buildMelonLoaderRules("HardBullet", [
            {
                route: path.join('UserData', 'CustomNPCs'),
                defaultFileExtensions: [".npc"],
                trackingMethod: 'STATE',
                subRoutes: []
            }]),
            buildBepInExRules("GreenHellVR"),
            buildBepInExRules("20MinutesTillDawn"),
            buildBepInExRules("VTOL_VR"),
            buildMelonLoaderRules("BackpackHero"),
            buildBepInExRules("Stacklands"),
            buildBepInExRules("ETG"),
            buildBepInExRules("Ravenfield"),
            buildBepInExRules("Aloft"),
            buildBepInExRules("COTL"),
            buildBepInExRules("ChronoArk"),
            InstallRules_BONELAB(),
            buildBepInExRules("TromboneChamp"),
            buildBepInExRules("RogueGenesia"),
            buildBepInExRules("AcrossTheObelisk"),
            buildBepInExRules("ULTRAKILL", [{
                route: path.join("BepInEx", "UMM Mods"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: []
            }]),
            buildBepInExRules("UltimateChickenHorse"),
            buildBepInExRules("AtrioTheDarkWild"),
            buildGodotMLRules("Brotato"),
            InstallRules_AncientDungeonVR(),
            buildMelonLoaderRules("RUMBLE"),
            buildGodotMLRules("DomeKeeper"),
            buildBepInExRules("SkulTheHeroSlayer"),
            buildBepInExRules("SonsOfTheForest"),
            buildBepInExRules("TheOuroborosKing"),
            buildBepInExRules("WrestlingEmpire"),
            buildBepInExRules("Receiver2"),
            buildBepInExRules("ThePlanetCrafter"),
            buildMelonLoaderRules("PatchQuest"),
            buildBepInExRules("ShadowsOverLoathing"),
            buildBepInExRules("WestofLoathing"),
            buildBepInExRules("SunHaven"),
            buildBepInExRules("Wildfrost"),
            buildBepInExRules("ShadowsofDoubt"),
            buildBepInExRules("WeLoveKatamariRerollRoyalReverie"),
            buildBepInExRules("Thronefall"),
            buildBepInExRules("Techtonica"),
            buildBepInExRules("GarfieldKartFuriousRacing"),
            buildBepInExRules("WizardOfLegend"),
            buildBepInExRules("BombRushCyberfunk"),
            buildBepInExRules("TouhouLostBranchOfLegend"),
            buildBepInExRules("WizardWithAGun"),
            buildBepInExRules("Sunkenland"),
            buildBepInExRules("Atomicrops"),
            buildBepInExRules("Erenshor"),
            buildBepInExRules("LastTrainOuttaWormtown"),
            buildBepInExRules("Dredge"),
            buildBepInExRules("CitiesSkylines2"),
            buildBepInExRules("LethalCompany"),
            buildBepInExRules("MeepleStation"),
            buildBepInExRules("VoidCrew"),
            buildBepInExRules("Sailwind"),
            buildBepInExRules("Plasma"),
            buildBepInExRules("ContentWarning"),
            buildBepInExRules("BoplBattle"),
            buildBepInExRules("Vertigo2"),
            buildBepInExRules("AgainstTheStorm"),
            buildBepInExRules("Lycans"),
            buildBepInExRules("CastleStory"),
            buildBepInExRules("Magicraft"),
            buildBepInExRules("AnotherCrabsTreasure"),
            buildBepInExRules("GladioMori"),
            buildBepInExRules("SlipstreamRogueSpace"),
            buildBepInExRules("BacktotheDawn"),
            buildBepInExRules("BelowTheStone"),
            buildBepInExRules("Gloomwood"),
            buildBepInExRules("AmongUs"),
            buildBepInExRules("BetrayalBeach"),
            buildBepInExRules("ArcusChroma"),
            buildBepInExRules("DeepRockGalacticSurvivor"),
            buildBepInExRules("AleAndTaleTavern"),
            buildBepInExRules("ScrewDrivers"),
            buildBepInExRules("NineSols"),
            buildBepInExRules("GoodbyeVolcanoHigh"),
            buildBepInExRules("SupermarketTogether"),
            buildBepInExRules("Shapez2"),
            buildBepInExRules("PaqueretteDownTheBunburrows"),
            buildBepInExRules("HardTime3"),
            buildBepInExRules("TankTeam"),
            buildBepInExRules("Distance"),
            buildBepInExRules("FiveNightsAtFreddysIntoThePit"),
            buildBepInExRules("GoreBox"),
            buildBepInExRules("TCGCardShopSimulator"),
            buildBepInExRules("OldMarketSimulator"),
            buildBepInExRules("Subterranauts"),
            buildBepInExRules("SULFUR"),
            buildBepInExRules("STRAFTAT"),
            buildBepInExRules("ATLYSS"),
            buildBepInExRules("PeaksOfYore"),
            buildBepInExRules("Subterror"),
            buildBepInExRules("IAmYourBeast"),
            buildBepInExRules("MiSide"),
            buildBepInExRules("REPO"),
        ]
    }
}
