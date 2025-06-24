import ProviderUtils from '../../generic/ProviderUtils';
import StatInterface from '../../generic/file/StatInterface';

export type NodeFsProvider = {
    writeFile: (path: string, content: string | Buffer) => Promise<void>;
    readFile: (path: string) => Promise<Buffer>;
    readdir: (path: string) => Promise<string[]>;
    rmdir: (path: string) => Promise<void>;
    mkdirs: (path: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
    unlink: (path: string) => Promise<void>;
    stat: (path: string) => Promise<StatInterface>;
    lstat: (path: string) => Promise<StatInterface>;
    realpath: (path: string) => Promise<string>;
    rename: (path: string, newPath: string) => Promise<void>;
    chmod: (path: string, mode: string | number) => Promise<void>;
    copyFile: (from: string, to: string) => Promise<void>;
    copyFolder: (from: string, to: string) => Promise<void>;
    base64FromZip: (path: string) => Promise<string>;
    setModifiedTime: (path: string, time: Date) => Promise<void>;
}

let implementation: () => NodeFsProvider;

function getImplementation() {
    if (!implementation) {
        ProviderUtils.throwNotProvidedError("NodeFsProvider")
    }
    return implementation();
}

export function provideFsImplementation(provider: () => NodeFsProvider) {
    implementation = provider;
}

const fs: NodeFsProvider = {
    writeFile: async (...args) => getImplementation().writeFile(...args),
    readFile: async (...args) => getImplementation().readFile(...args),
    readdir: async (...args) => getImplementation().readdir(...args),
    rmdir: async (...args) => getImplementation().rmdir(...args),
    mkdirs: async (...args) => getImplementation().mkdirs(...args),
    exists: async (...args) => getImplementation().exists(...args),
    unlink: async (...args) => getImplementation().unlink(...args),
    stat: async (...args) => getImplementation().stat(...args),
    lstat: async (...args) => getImplementation().lstat(...args),
    realpath: async (...args) => getImplementation().realpath(...args),
    rename: async (...args) => getImplementation().rename(...args),
    chmod: async (...args) => getImplementation().chmod(...args),
    copyFile: async (...args) => getImplementation().copyFile(...args),
    copyFolder: async (...args) => getImplementation().copyFolder(...args),
    base64FromZip: async (...args) => getImplementation().base64FromZip(...args),
    setModifiedTime: async (...args) => getImplementation().setModifiedTime(...args),
};

export default fs;
