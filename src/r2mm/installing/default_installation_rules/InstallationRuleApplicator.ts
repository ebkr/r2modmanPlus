import InstallationRules, { normalizeRuleSubtype } from '../InstallationRules';
import { EcosystemSchema } from '../../../model/schema/ThunderstoreSchema';

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = EcosystemSchema.supportedGames.map((x) => ({
            gameName: x.internalFolderName,
            rules: x.installRules.map(normalizeRuleSubtype),
            relativeFileExclusions: x.relativeFileExclusions,
        }));
    }
}
