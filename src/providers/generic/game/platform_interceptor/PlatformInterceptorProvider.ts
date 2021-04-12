import ProviderUtils from '../../../../providers/generic/ProviderUtils';
import { StorePlatform } from 'src/model/game/StorePlatform';
import GameRunnerProvider from 'src/providers/generic/game/GameRunnerProvider';
import GameDirectoryResolverProvider from 'src/providers/ror2/game/GameDirectoryResolverProvider';

export default abstract class PlatformInterceptorProvider {

    private static provider: () => PlatformInterceptorProvider;
    static provide(provided: () => PlatformInterceptorProvider): void {
        this.provider = provided;
    }

    public static get instance(): PlatformInterceptorProvider {
        if (PlatformInterceptorProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("PlatformInterceptorProvider");
        }
        return PlatformInterceptorProvider.provider();
    }

    public abstract getRunnerForPlatform(platform: StorePlatform): GameRunnerProvider | undefined;
    public abstract getDirectoryResolverForPlatform(platform: StorePlatform): GameDirectoryResolverProvider | undefined;

}
