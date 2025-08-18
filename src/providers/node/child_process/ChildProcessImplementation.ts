import { NodeChildProcessProvider } from './child_process';

let execIdentifier = 0;

export const NodeChildProcessImplementation: NodeChildProcessProvider = {
    execSync: path => window.node.child_process.execSync(path),
    exec: async (path, options, callback) => {
        // Error is passed directly into resolve to keep compatibility with callback implementations.
        // Therefore no need to use a `.catch` block
        window.node.child_process.exec(path, options)
            .then(err => {
                if (callback) {
                    callback(err as unknown as Error);
                }
            });
    }
}
