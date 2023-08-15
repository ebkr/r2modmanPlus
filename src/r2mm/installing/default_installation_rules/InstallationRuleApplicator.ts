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
            buildBepInExRules("7DaysToDie"),
        ]
    }
}
