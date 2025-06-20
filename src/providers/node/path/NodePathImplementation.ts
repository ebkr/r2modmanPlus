import { NodePathProvider } from './path';

export const NodePathImplementation: NodePathProvider = {
    // @ts-ignore
    join: paths => window.node.path.join(...paths),
    extname: path => { throw new Error() },
    relative: (pathOne, pathTwo) => { throw new Error() },
    basename: path => { throw new Error() },
    dirname: path => { throw new Error() },
    resolve: paths => { throw new Error() },
}
