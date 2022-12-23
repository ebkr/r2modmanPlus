import ProviderUtils from '../../generic/ProviderUtils';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';

export default abstract class ConflictManagementProvider {

    private static provider: () => ConflictManagementProvider;

    static provide(provided: () => ConflictManagementProvider): void {
        this.provider = provided;
    }

    public static get instance(): ConflictManagementProvider {
        if (ConflictManagementProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ConflictManagementProvider");
        }
        return ConflictManagementProvider.provider();
    }

    public abstract resolveConflicts(mods: ManifestV2[], profile: Profile): Promise<R2Error | void>;

    public abstract overrideInstalledState(mod: ManifestV2, profile: Profile): Promise<R2Error | void>;

    public abstract isFileActive(mod: ManifestV2, profile: Profile, file: string): Promise<boolean>;

}


