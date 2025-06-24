import { NodeChildProcessImplementation } from 'src/providers/node/child_process/ChildProcessImplementation';

export type NodeChildProcessProvider = {
    execSync: (path: string, options?: any) => string;
    exec: (path: string, options?: any, callback?: (err: Error) => void) => Promise<void>;
}

let implementation: () => NodeChildProcessProvider;

function getImplementation(): NodeChildProcessProvider {
    if (!implementation) {
        return NodeChildProcessImplementation;
    }
    return implementation();
}

export function provideChildProcessImplementation(provider: () => NodeChildProcessProvider) {
    implementation = provider;
}

const childProcess: NodeChildProcessProvider = {
    execSync: path => getImplementation().execSync(path),
    exec: (path, options, callback) => getImplementation().exec(path, options, callback),
};

export default childProcess;
