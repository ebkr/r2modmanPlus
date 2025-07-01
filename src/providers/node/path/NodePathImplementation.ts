import { NodePathProvider } from './path';

export const NodePathImplementation: NodePathProvider = {
    // @ts-ignore
    join: (...args) => window.node.path.join(...args),
    extname: path => { throw new Error() },
    relative: (pathOne, pathTwo) => { throw new Error() },
    basename: path => window.node.path.basename(path),
    dirname: path => { throw new Error() },
    resolve: (...args) => window.node.path.resolve(...args),
}
