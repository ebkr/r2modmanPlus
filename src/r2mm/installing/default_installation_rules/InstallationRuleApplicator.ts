import InstallationRules from '../InstallationRules';
import InstallRules_RiskOfRain2 from '../default_installation_rules/game_rules/InstallRules_RiskOfRain2';
import InstallRules_DysonSphereProgram from '../default_installation_rules/game_rules/InstallRules_DysonSphereProgram';
import InstallRules_Valheim from '../default_installation_rules/game_rules/InstallRules_Valheim';
import InstallRules_GTFO from '../default_installation_rules/game_rules/InstallRules_GTFO';
import InstallRules_Outward from '../default_installation_rules/game_rules/InstallRules_Outward';
import InstallRules_OutwardDe from '../default_installation_rules/game_rules/InstallRules_OutwardDe';
import InstallRules_TaleSpire from '../default_installation_rules/game_rules/InstallRules_TaleSpire';
import InstallRules_H3VR from '../default_installation_rules/game_rules/InstallRules_H3VR';
import InstallRules_ROUNDS from '../default_installation_rules/game_rules/InstallRules_ROUNDS';
import InstallRules_Muck from '../default_installation_rules/game_rules/InstallRules_Muck';
import InstallRules_Mechanica from '../default_installation_rules/game_rules/InstallRules_Mechanica';
import InstallRules_BONEWORKS from '../default_installation_rules/game_rules/InstallRules_BONEWORKS';
import InstallRules_Timberborn from '../default_installation_rules/game_rules/InstallRules_Timberborn';
import InstallRules_ThunderstoreDev from '../default_installation_rules/game_rules/InstallRules_ThunderstoreDev';
import InstallRules_LethalLeagueBlaze from '../default_installation_rules/game_rules/InstallRules_LethalLeagueBlaze';
import InstallRules_TotallyAccurateBattleSimulator
    from '../default_installation_rules/game_rules/InstallRules_TotallyAccurateBattleSimulator';
import InstallRules_NASB from '../default_installation_rules/game_rules/InstallRules_NASB';
import InstallRules_Inscryption from '../default_installation_rules/game_rules/InstallRules_Inscryption';
import InstallRules_Starsand from '../default_installation_rules/game_rules/InstallRules_Starsand';
import InstallRules_CatsAreLiquidABP from '../default_installation_rules/game_rules/InstallRules_CatsAreLiquidABP';
import InstallRules_PotionCraft from '../default_installation_rules/game_rules/InstallRules_PotionCraft';
import InstallRules_NearlyDead from '../default_installation_rules/game_rules/InstallRules_NearlyDead';
import InstallRules_AGAINST from '../default_installation_rules/game_rules/InstallRules_AGAINST';
import InstallRules_RogueTower from '../default_installation_rules/game_rules/InstallRules_RogueTower';
import InstallRules_HOTDS from '../default_installation_rules/game_rules/InstallRules_HOTDS';
import InstallRules_ForTheKing from '../default_installation_rules/game_rules/InstallRules_ForTheKing';
import InstallRules_Subnautica from '../default_installation_rules/game_rules/InstallRules_Subnautica';
import InstallRules_SubnauticaBZ from '../default_installation_rules/game_rules/InstallRules_SubnauticaBZ';
import InstallRules_CoreKeeper from '../default_installation_rules/game_rules/InstallRules_CoreKeeper';
import InstallRules_Titanfall2 from '../default_installation_rules/game_rules/InstallRules_Titanfall2';
import InstallRules_Peglin from '../default_installation_rules/game_rules/InstallRules_Peglin';
import InstallRules_VRising from '../default_installation_rules/game_rules/InstallRules_VRising';
import InstallRules_HardBullet from '../default_installation_rules/game_rules/InstallRules_HardBullet';
import InstallRules_GreenHellVR from '../default_installation_rules/game_rules/InstallRules_GreenHellVR';
import InstallRules_20MinutesTillDawn from '../default_installation_rules/game_rules/InstallRules_20MinutesTillDawn';
import InstallRules_VTOL_VR from '../default_installation_rules/game_rules/InstallRules_VTOL_VR';
import InstallRules_BackpackHero from '../default_installation_rules/game_rules/InstallRules_BackpackHero';
import InstallRules_Stacklands from '../default_installation_rules/game_rules/InstallRules_Stacklands';
import InstallRules_EnterTheGungeon from '../default_installation_rules/game_rules/InstallRules_EnterTheGungeon';
import InstallRules_Ravenfield from '../default_installation_rules/game_rules/InstallRules_Ravenfield';
import InstallRules_Aloft from '../default_installation_rules/game_rules/InstallRules_Aloft';
import InstallRules_COTL from '../default_installation_rules/game_rules/InstallRules_COTL';

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = [
            InstallRules_RiskOfRain2(),
            InstallRules_ThunderstoreDev(),
            InstallRules_DysonSphereProgram(),
            InstallRules_Valheim(),
            InstallRules_GTFO(),
            InstallRules_Outward(),
            InstallRules_OutwardDe(),
            InstallRules_TaleSpire(),
            InstallRules_H3VR(),
            InstallRules_ROUNDS(),
            InstallRules_Mechanica(),
            InstallRules_Muck(),
            InstallRules_BONEWORKS(),
            InstallRules_LethalLeagueBlaze(),
            InstallRules_Timberborn(),
            InstallRules_TotallyAccurateBattleSimulator(),
            InstallRules_NASB(),
            InstallRules_Inscryption(),
            InstallRules_Starsand(),
            InstallRules_CatsAreLiquidABP(),
            InstallRules_PotionCraft(),
            InstallRules_NearlyDead(),
            InstallRules_AGAINST(),
            InstallRules_RogueTower(),
            InstallRules_HOTDS(),
            InstallRules_ForTheKing(),
            InstallRules_Subnautica(),
            InstallRules_SubnauticaBZ(),
            InstallRules_CoreKeeper(),
            InstallRules_Titanfall2(),
            InstallRules_Peglin(),
            InstallRules_VRising(),
            InstallRules_HardBullet(),
            InstallRules_GreenHellVR(),
            InstallRules_20MinutesTillDawn(),
            InstallRules_VTOL_VR(),
            InstallRules_BackpackHero(),
            InstallRules_Stacklands(),
            InstallRules_EnterTheGungeon(),
            InstallRules_Ravenfield(),
            InstallRules_Aloft(),
            InstallRules_COTL(),
        ]
    }

}
