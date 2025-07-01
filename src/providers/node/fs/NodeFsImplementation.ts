import { NodeFsProvider } from './fs';
import Lock from 'async-lock';

const lock = new Lock();

function acquireLockAndDo(path: string, action: (resolve: any, reject: any) => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
        lock.acquire(path, async () => {
            await action(resolve, reject);
        })
    })
}

function resolveStat(statLike: any) {
    return {
        ...statLike,
        isDirectory: () => {
            return statLike.isDirectory;
        }
    }
}

export const NodeFsImplementation: NodeFsProvider = {
    writeFile: async (...args) => {
        const path = [...args][0] as string;
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.writeFile(...args).then(resolve).catch(reject));
    },
    readFile: async (...args) => {
        const [ path ] = args;
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.readFile(...args).then(resolve).catch(reject));
    },
    readdir: async (...args) => {
        const [ path ] = args;
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.readdir(...args).then(resolve).catch(reject));
    },
    rmdir: async (...args) => window.node.fs.rmdir(...args),
    mkdirs: async (...args) => {
        const [ path ] = args;
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.mkdirs(...args).then(resolve).catch(reject));
    },
    exists: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.exists(...args).then(resolve).catch(reject));
    },
    unlink: async (...args) => window.node.fs.unlink(...args),
    stat: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.stat(...args).then(result => {
            resolve(resolveStat(result));
        }).catch(reject));
    },
    lstat: async (...args) => window.node.fs.lstat(...args),
    realpath: async (...args) => window.node.fs.realpath(...args),
    rename: async (...args) => window.node.fs.rename(...args),
    chmod: async (...args) => window.node.fs.chmod(...args),
    copyFile: async (...args) => window.node.fs.copyFile(...args),
    copyFolder: async (...args) => window.node.fs.copyFolder(...args),
    base64FromZip: async (...args) => window.node.fs.base64FromZip(...args),
    setModifiedTime: async (...args) => window.node.fs.setModifiedTime(...args),
}
