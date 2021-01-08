import ProviderUtils from '../../generic/ProviderUtils';
import R2Error from '../../../model/errors/R2Error';

export default abstract class GameDirectoryResolverProvider {

    private static provider: () => GameDirectoryResolverProvider;

    static provide(provided: () => GameDirectoryResolverProvider): void {
        this.provider = provided;
    }

    public static get instance(): GameDirectoryResolverProvider {
        if (GameDirectoryResolverProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError('GameDirectoryResolverProvider');
        }
        return GameDirectoryResolverProvider.provider();
    }

    public abstract getSteamDirectory(): Promise<string | R2Error>;
    public abstract getDirectory(): Promise<string | R2Error>;

}
