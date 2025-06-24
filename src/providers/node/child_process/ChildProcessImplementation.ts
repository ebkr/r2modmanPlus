import { NodeChildProcessProvider } from './child_process';

let execIdentifier = 0;

export const NodeChildProcessImplementation: NodeChildProcessProvider = {
    execSync: path => window.node.child_process.execSync(path),
    exec: async (path, options, callback) => {
        const identifier = execIdentifier++;
        if (callback) {
            window.hooks.once(`node:child_process:exec:${identifier}`, callback);
        }
        window.node.child_process.exec(identifier, path, options);
    }
}
