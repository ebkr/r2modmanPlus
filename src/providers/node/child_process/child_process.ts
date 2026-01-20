import { NodeChildProcessImplementation } from './ChildProcessImplementation';

export type NodeChildProcessProvider = {
    execSync: (path: string, options?: any) => string;
    exec: (path: string, options?: any, callback?: (err: Error) => void) => Promise<void>;
    spawnSync: (path: string, args?: string[], options?: object) => string;
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
    spawnSync: (path, args, options) => getImplementation().spawnSync(path, args, options),
};

export default childProcess;
