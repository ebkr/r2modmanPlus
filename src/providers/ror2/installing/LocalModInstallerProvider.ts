import ProviderUtils from '../../generic/ProviderUtils';
import R2Error from '../../../model/errors/R2Error';
import Profile from '../../../model/Profile';
import ManifestV2 from '../../../model/ManifestV2';

export default abstract class LocalModInstallerProvider {

    private static provider: () => LocalModInstallerProvider;
    static provide(provided: () => LocalModInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): LocalModInstallerProvider {
        if (LocalModInstallerProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("LocalModInstallerProvider");
        }
        return LocalModInstallerProvider.provider();
    }

    /**
     * Extract a zip into the corresponding cache location.
     * Used for installing mods locally with a supporting {@class ManifestV2} manifest.
     *
     * @param profile
     * @param zipFile   Path to the zip file.
     * @param callback  Callback to report if the extraction was successful.
     */
    public abstract extractToCache(profile: Profile, zipFile: string, callback: (success: boolean, error: R2Error | null) => void): Promise<R2Error | void>;
    public abstract extractToCacheWithManifestData(profile: Profile, zipFile: string, manifest: ManifestV2, callback: (success: boolean, error: R2Error | null) => void): Promise<R2Error | void>;
    public abstract placeFileInCache(profile: Profile, file: string, manifest: ManifestV2, callback: (success: boolean, error: R2Error | null) => void): Promise<R2Error | void>;

}
