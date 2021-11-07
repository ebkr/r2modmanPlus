import InstallationRules from '../InstallationRules';
import InstallRules_RiskOfRain2
    from '../default_installation_rules/game_rules/InstallRules_RiskOfRain2';
import InstallRules_DysonSphereProgram
    from '../default_installation_rules/game_rules/InstallRules_DysonSphereProgram';
import InstallRules_Valheim from '../default_installation_rules/game_rules/InstallRules_Valheim';
import InstallRules_GTFO from '../default_installation_rules/game_rules/InstallRules_GTFO';
import InstallRules_Outward from '../default_installation_rules/game_rules/InstallRules_Outward';
import InstallRules_TaleSpire from '../default_installation_rules/game_rules/InstallRules_TaleSpire';
import InstallRules_H3VR from '../default_installation_rules/game_rules/InstallRules_H3VR';
import InstallRules_ROUNDS from '../default_installation_rules/game_rules/InstallRules_ROUNDS';
import InstallRules_Muck from '../default_installation_rules/game_rules/InstallRules_Muck';
import InstallRules_Mechanica from '../default_installation_rules/game_rules/InstallRules_Mechanica';
import InstallRules_BONEWORKS from '../default_installation_rules/game_rules/InstallRules_BONEWORKS';
import InstallRules_Timberborn from '../default_installation_rules/game_rules/InstallRules_Timberborn';
import InstallRules_ThunderstoreDev
    from '../default_installation_rules/game_rules/InstallRules_ThunderstoreDev';
import InstallRules_LethalLeagueBlaze
    from '../default_installation_rules/game_rules/InstallRules_LethalLeagueBlaze';
import InstallRules_TotallyAccurateBattleSimulator
    from '../default_installation_rules/game_rules/InstallRules_TotallyAccurateBattleSimulator';
import InstallRules_NASB from '../default_installation_rules/game_rules/InstallRules_NASB';
import InstallRules_Inscryption
    from 'src/r2mm/installing/default_installation_rules/game_rules/InstallRules_Inscryption';
import InstallRules_Starsand from 'src/r2mm/installing/default_installation_rules/game_rules/InstallRules_Starsand';

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = [
            InstallRules_RiskOfRain2(),
            InstallRules_ThunderstoreDev(),
            InstallRules_DysonSphereProgram(),
            InstallRules_Valheim(),
            InstallRules_GTFO(),
            InstallRules_Outward(),
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
        ]
    }

}
