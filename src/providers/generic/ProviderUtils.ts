import R2Error from '../../model/errors/R2Error';
import Game from '../../model/game/Game';
import ProviderError from '../../model/errors/ProviderError';
import { Platform } from '../../model/schema/ThunderstoreSchema';
import ConflictManagementProviderImpl from '../../r2mm/installing/ConflictManagementProviderImpl';
import GameDirectoryResolverProvider from '../ror2/game/GameDirectoryResolverProvider';
import GameRunnerProvider from './game/GameRunnerProvider';
import PlatformInterceptorProvider from './game/platform_interceptor/PlatformInterceptorProvider';
import ConflictManagementProvider from './installing/ConflictManagementProvider';
import { useProviderStore } from '../../store/provider/provider_store';

export default class ProviderUtils {

    public static setupGameProviders(game: Game, platform: Platform) {
        const runner = PlatformInterceptorProvider.instance.getRunnerForPlatform(platform, game.packageLoader);

        if (runner === undefined) {
            throw new R2Error("No suitable runner found", "Runner is likely not yet implemented.", null);
        }

        const resolver = PlatformInterceptorProvider.instance.getDirectoryResolverForPlatform(platform);

        if (resolver === undefined) {
            throw new R2Error("No suitable resolver found", "Resolver is likely not yet implemented.", null);
        }

        GameRunnerProvider.provide(() => runner);
        GameDirectoryResolverProvider.provide(() => resolver);
        const { setGameDirectoryResolverProvider } = useProviderStore();
        setGameDirectoryResolverProvider(() => resolver);
        ConflictManagementProvider.provide(() => new ConflictManagementProviderImpl());
    }

    public static throwNotProvidedError(providerName: string) {
        throw new ProviderError(
            `${providerName} has not been provided`,
            `A provider needs to be specified for the ${providerName} class`,
            "Declare the provider in your custom App.vue override"
        );
    }

}
