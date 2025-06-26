import { NodePathProvider } from './path';

export const NodePathImplementation: NodePathProvider = {
    // @ts-ignore
    join: (...args) => window.node.path.join(...args),
    extname: path => { throw new Error() },
    relative: (pathOne, pathTwo) => { throw new Error() },
    basename: path => { throw new Error() },
    dirname: path => { throw new Error() },
    resolve: paths => { throw new Error() },
}
