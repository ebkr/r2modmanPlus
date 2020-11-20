import ProviderUtils from '../../generic/ProviderUtils';
import R2Error from '../../../model/errors/R2Error';

export default abstract class LocalModInstallerProvider {

    private static provider: () => LocalModInstallerProvider;
    static provide(provided: () => LocalModInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): LocalModInstallerProvider {
        if (LocalModInstallerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("LocalModInstallerProvider");
        }
        return LocalModInstallerProvider.provider();
    }

    /**
     * Extract a zip into the corresponding cache location.
     * Used for installing mods locally with a supporting {@class ManifestV2} manifest.
     *
     * @param zipFile   Path to the zip file.
     * @param callback  Callback to report if the extraction was successful.
     */
    public abstract async extractToCache(zipFile: string, callback: (success: boolean, error: R2Error | null) => void): Promise<R2Error | void>;

}
