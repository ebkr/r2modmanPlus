import { NodePathProvider } from './path';

export const NodePathImplementation: NodePathProvider = {
    join: (...args) => window.node.path.join(...args),
    extname: (...args) => window.node.path.extname(...args),
    relative: (...args) => window.node.path.relative(...args),
    basename: (...args) => window.node.path.basename(...args),
    dirname: (...args) => window.node.path.dirname(...args),
    resolve: (...args) => window.node.path.resolve(...args),
    get sep() {
        return window.node.path.sep()
    }
}
