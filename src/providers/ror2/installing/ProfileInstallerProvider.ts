import ProviderUtils from '../../generic/ProviderUtils';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';

export default abstract class ProfileInstallerProvider {

    private static provider: () => ProfileInstallerProvider;
    static provide(provided: () => ProfileInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileInstallerProvider {
        if (ProfileInstallerProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError('ProfileInstallerProvider');
        }
        return ProfileInstallerProvider.provider();
    }

    /**
     * Removes a mod from the profile. Does not affect the mod list display.
     * @param mod
     */
    public abstract uninstallMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null>;

    /**
     * Disable files to prevent the mod from loading.
     * @param mod
     */
    public abstract disableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void>;

    /**
     * Enable files to undo a disable operation.
     * @param mod
     */
    public abstract enableMod(mod: ManifestV2, profile: Profile): Promise<R2Error | void>;

    /**
     * Installs a mod to the profile.
     * @param mod
     */
    public abstract installMod(mod: ManifestV2, profile: Profile): Promise<R2Error | null>;
}
