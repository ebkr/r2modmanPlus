import ProviderUtils from '../../generic/ProviderUtils';

export type NodeOsProvider = {
    homedir: () => string;
}

let implementation: () => NodeOsProvider;

function getImplementation() {
    if (!implementation) {
        ProviderUtils.throwNotProvidedError("NodeOsProvider")
    }
    return implementation();
}

export function provideOsImplementation(provider: () => NodeOsProvider) {
    implementation = provider;
}

const os: NodeOsProvider = {
    homedir: () => getImplementation().homedir()
};

export default os;
