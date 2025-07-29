import { NodePathImplementation } from './NodePathImplementation';

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
    process.stdout.write(`Implementation exists? ${!!implementation}\n`);
    if (implementation === undefined) {
        process.stdout.write(`Implementation does not exist\n`);
        return NodePathImplementation;
    }
    return implementation();
}

export function providePathImplementation(provider: () => NodePathProvider) {
    process.stdout.write(`provider: ${JSON.stringify(provider())}`);
    implementation = provider;
}

const nodePath: NodePathProvider = {
    join: (...args) => getImplementation().join(...args),
    dirname: path => getImplementation().dirname(path),
    extname: path => getImplementation().extname(path),
    basename: path => getImplementation().basename(path),
    relative: (pathOne, pathTwo) => getImplementation().relative(pathOne, pathTwo),
    resolve: paths => getImplementation().resolve(paths),
};

export default nodePath;
