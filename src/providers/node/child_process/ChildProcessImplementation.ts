import { NodeChildProcessProvider } from './child_process';

let execIdentifier = 0;

export const NodeChildProcessImplementation: NodeChildProcessProvider = {
    execSync: path => window.node.child_process.execSync(path),
    exec: async (path, options, callback) => {
        window.node.child_process.exec(path, options)
            .then(err => {
                if (callback) {
                    callback(err as unknown as Error);
                }
            })
            .catch(err => {
                if (callback) {
                    callback(err as Error);
                }
            })
    }
}
