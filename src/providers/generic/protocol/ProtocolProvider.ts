import { ProtocolProviderImplementation } from './ProtocolProviderImplementation';

export type ProtocolProvider = {
    getPublicAssetUrl: (url: string) => string;
}

let implementation: () => ProtocolProvider;

function getImplementation(): ProtocolProvider {
    if (!implementation) {
        return ProtocolProviderImplementation;
    }
    return implementation();
}

export function provideProtocolImplementation(provider: () => ProtocolProvider) {
    implementation = provider;
}

const protocol: ProtocolProvider = {
    getPublicAssetUrl: (...args) => getImplementation().getPublicAssetUrl(...args),
};

export default protocol;
