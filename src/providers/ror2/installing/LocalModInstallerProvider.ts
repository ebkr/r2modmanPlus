import ProviderUtils from '../ProviderUtils';
import R2Error from '../../../model/errors/R2Error';

export default abstract class LocalModInstallerProvider {

    static provider: () => LocalModInstallerProvider;

    static provide(provided: () => LocalModInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): LocalModInstallerProvider {
        if (LocalModInstallerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("LocalModInstallerProvider");
        }
        return LocalModInstallerProvider.provider();
    }

    public abstract extractToCache(zipFile: string, callback: (success: boolean, error: R2Error | null) => void): R2Error | void;

}
