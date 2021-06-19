import FsProvider from 'src/providers/generic/file/FsProvider';
import StatInterface from 'src/providers/generic/file/StatInterface';

export default class StubFsProvider extends FsProvider {

    async base64FromZip(path: string): Promise<string> {
        return Promise.resolve('');
    }

    async chmod(path: string, mode: string | number): Promise<void> {
        return Promise.resolve(undefined);
    }

    async copyFile(from: string, to: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async copyFolder(from: string, to: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async exists(path: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    async lstat(path: string): Promise<StatInterface> {
        return Promise.resolve({
            isDirectory: () => false,
            isFile: () => false,
            mtime: new Date(Date.now()),
        });
    }

    async mkdirs(path: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async readFile(path: string): Promise<Buffer> {
        return Promise.resolve(Buffer.of());
    }

    async readdir(path: string): Promise<string[]> {
        return Promise.resolve([]);
    }

    async realpath(path: string): Promise<string> {
        return Promise.resolve('');
    }

    async rename(path: string, newPath: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async rmdir(path: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async stat(path: string): Promise<StatInterface> {
        return Promise.resolve({
            isDirectory: () => false,
            isFile: () => false,
            mtime: new Date(Date.now()),
        });
    }

    async unlink(path: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async writeFile(path: string, content: string | Buffer): Promise<void> {
        return Promise.resolve(undefined);
    }



}
