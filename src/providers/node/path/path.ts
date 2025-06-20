import ProviderUtils from 'src/providers/generic/ProviderUtils';

export type NodePathProvider = {
    join: (...paths: string[]) => string;
    dirname: (path: string) => string;
    extname: (path: string) => string;
    basename: (path: string) => string;
    relative: (pathOne: string, pathTwo: string) => string;
    resolve: (...paths: string[]) => string;
}

let implementation: () => NodePathProvider;

function getImplementation() {
    if (!implementation) {
        ProviderUtils.throwNotProvidedError("NodePathProvider")
    }
    return implementation();
}

export function providePathImplementation(provider: () => NodePathProvider) {
    implementation = provider;
}

const nodePath: NodePathProvider = {
    join: paths => getImplementation().join(paths),
    dirname: path => getImplementation().dirname(path),
    extname: path => getImplementation().extname(path),
    basename: path => getImplementation().basename(path),
    relative: (pathOne, pathTwo) => getImplementation().relative(pathOne, pathTwo),
    resolve: paths => getImplementation().resolve(paths),
};

export default nodePath;
