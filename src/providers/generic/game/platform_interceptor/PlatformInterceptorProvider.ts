import ProviderUtils from '../../../../providers/generic/ProviderUtils';
import { StorePlatform } from '../../../../model/game/StorePlatform';
import GameRunnerProvider from '../../../generic/game/GameRunnerProvider';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import { PackageLoader } from '../../../../model/installing/PackageLoader';

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

    public abstract getRunnerForPlatform(platform: StorePlatform, loader: PackageLoader): GameRunnerProvider | undefined;
    public abstract getDirectoryResolverForPlatform(platform: StorePlatform, loader: PackageLoader): GameDirectoryResolverProvider | undefined;

}
