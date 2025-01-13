import InstallationRules, { CoreRuleType } from '../InstallationRules';
import { EcosystemSchema } from '../../../model/schema/ThunderstoreSchema';

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = EcosystemSchema.supportedGames
            .map((x) => <CoreRuleType>{
                gameName: x.r2modman!.internalFolderName,
                rules: x.r2modman!.installRules,
            });
    }
}
