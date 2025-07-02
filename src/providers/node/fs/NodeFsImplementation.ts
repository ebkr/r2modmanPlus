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
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.readFile(...args).then(resolve).catch(reject));
    },
    readdir: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.readdir(...args).then(resolve).catch(reject));
    },
    rmdir: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.rmdir(...args).then(resolve).catch(reject));
    },
    mkdirs: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.mkdirs(...args).then(resolve).catch(reject));
    },
    exists: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.exists(...args).then(resolve).catch(reject));
    },
    unlink: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.unlink(...args).then(resolve).catch(reject));
    },
    stat: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.stat(...args).then(result => {
            resolve(resolveStat(result));
        }).catch(reject));
    },
    lstat: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.lstat(...args).then(result => {
            // TODO QUASAR UPGRADE - Need to verify this
            resolve(resolveStat(result));
        }).catch(reject));
    },
    realpath: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.realpath(...args).then(resolve).catch(reject));
    },
    rename: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.rename(...args).then(resolve).catch(reject));
    },
    chmod: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.chmod(...args).then(resolve).catch(reject));
    },
    copyFile: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.copyFile(...args).then(resolve).catch(reject));
    },
    copyFolder: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.copyFolder(...args).then(resolve).catch(reject));
    },
    base64FromZip: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.base64FromZip(...args).then(resolve).catch(reject));
    },
    setModifiedTime: async (...args) => {
        const path = args[0];
        return acquireLockAndDo(path, async (resolve, reject) => window.node.fs.setModifiedTime(...args).then(resolve).catch(reject));
    },
}
