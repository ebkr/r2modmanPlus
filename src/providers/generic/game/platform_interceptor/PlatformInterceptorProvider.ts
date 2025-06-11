import ProviderUtils from '../../../../providers/generic/ProviderUtils';
import GameRunnerProvider from '../../../generic/game/GameRunnerProvider';
import GameDirectoryResolverProvider from '../../../ror2/game/GameDirectoryResolverProvider';
import { PackageLoader } from '../../../../model/installing/PackageLoader';
import { Platform } from '../../../../model/schema/ThunderstoreSchema';

export default abstract class PlatformInterceptorProvider {

    private static provider: () => PlatformInterceptorProvider;
    static provide(provided: () => PlatformInterceptorProvider): void {
        this.provider = provided;
    }

    public static get instance(): PlatformInterceptorProvider {
        if (PlatformInterceptorProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("PlatformInterceptorProvider");
        }
        return PlatformInterceptorProvider.provider();
    }

    public abstract getRunnerForPlatform(platform: Platform, loader: PackageLoader): GameRunnerProvider | undefined;
    public abstract getDirectoryResolverForPlatform(platform: Platform): GameDirectoryResolverProvider | undefined;

}
