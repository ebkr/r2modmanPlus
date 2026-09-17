import ProviderUtils from '../ProviderUtils';

export type GameImageProvider = {
    init(): Promise<void>;
    readonly placeholderUrl: string;
    resolve(iconUrl: string): Promise<string>;
    prefetchAll(iconUrls: string[]): Promise<void>;
};

let implementation: (() => GameImageProvider) | undefined;

function getImplementation(): GameImageProvider {
    if (!implementation) {
        ProviderUtils.throwNotProvidedError("GameImageProvider");
    }
    return implementation!();
}

export function provideGameImageImplementation(provider: () => GameImageProvider) {
    implementation = provider;
}

const gameImage: GameImageProvider = {
    init: () => getImplementation().init(),
    get placeholderUrl() { return getImplementation().placeholderUrl; },
    resolve: (iconUrl) => getImplementation().resolve(iconUrl),
    prefetchAll: (iconUrls) => getImplementation().prefetchAll(iconUrls),
};

export default gameImage;
