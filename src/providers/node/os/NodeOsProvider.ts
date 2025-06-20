import ProviderUtils from 'src/providers/generic/ProviderUtils';

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
    homedir: () => {
        return getImplementation().homedir();
    }
};

export default os;
