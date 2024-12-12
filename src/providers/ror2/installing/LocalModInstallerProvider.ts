import ProviderUtils from '../../generic/ProviderUtils';
import { ImmutableProfile } from '../../../model/Profile';
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
    public abstract extractToCacheWithManifestData(profile: ImmutableProfile, zipFile: string, manifest: ManifestV2): Promise<void>;
    public abstract placeFileInCache(profile: ImmutableProfile, file: string, manifest: ManifestV2): Promise<void>;

}
