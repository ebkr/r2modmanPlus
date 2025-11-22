import { NodeFsProvider } from './fs';
import Lock from 'async-lock';

const lock = new Lock();

async function acquireLockAndDo(path: string, action: Promise<any>) {
    return await lock.acquire(path, async () => {
        return await action;
    });
}

function resolveStat(statLike: any) {
    return {
        ...statLike,
        isDirectory: () => {
            return statLike.isDirectory;
        },
        isFile: () => {
            return statLike.isFile;
        },
        mtime: new Date(statLike.mtimeMs),
    }
}

export const NodeFsImplementation: NodeFsProvider = {
    writeFile: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.writeFile(...args));
    },
    readFile: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.readFile(...args));
    },
    readdir: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.readdir(...args));
    },
    rmdir: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.rmdir(...args));
    },
    mkdirs: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.mkdirs(...args));
    },
    exists: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.exists(...args));
    },
    unlink: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.unlink(...args));
    },
    stat: async (...args) => {
        const path = args[0];
        let result = await acquireLockAndDo(path, window.node.fs.stat(...args)); // TODO QUASAR UPGRADE - Need to verify this
        return resolveStat(result);
    },
    lstat: async (...args) => {
        const path = args[0];
        let result = await acquireLockAndDo(path, window.node.fs.lstat(...args)); // TODO QUASAR UPGRADE - Need to verify this
        return resolveStat(result);
    },
    realpath: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.realpath(...args));
    },
    rename: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.rename(...args));
    },
    chmod: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.chmod(...args));
    },
    copyFile: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.copyFile(...args));
    },
    copyFolder: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.copyFolder(...args));
    },
    base64FromZip: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.base64FromZip(...args));
    },
    setModifiedTime: async (...args) => {
        const path = args[0];
        return await acquireLockAndDo(path, window.node.fs.setModifiedTime(...args));
    },
}
