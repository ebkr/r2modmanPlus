import InstallationRules, { normalizeRuleSubtype } from '../InstallationRules';
import { EcosystemSchema } from '../../../model/schema/ThunderstoreSchema';

export default class InstallationRuleApplicator {

    public static apply() {
        InstallationRules.RULES = EcosystemSchema.supportedGames.map((x) => ({
            gameName: x.r2modman.internalFolderName,
            rules: x.r2modman.installRules.map(normalizeRuleSubtype),
            relativeFileExclusions: x.r2modman.relativeFileExclusions,
        }));
    }
}
