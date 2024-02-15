import { Readable } from 'stream';
import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import StatInterface from '../../../../../src/providers/generic/file/StatInterface';

export default class StubFsProvider extends FsProvider {

    async base64FromZip(path: string): Promise<string> {
        throw new Error("Stub access must be mocked or spied");
    }

    async chmod(path: string, mode: string | number): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async copyFile(from: string, to: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async copyFolder(from: string, to: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async exists(path: string): Promise<boolean> {
        throw new Error("Stub access must be mocked or spied");
    }

    async lstat(path: string): Promise<StatInterface> {
        throw new Error("Stub access must be mocked or spied");
    }

    async mkdirs(path: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async readFile(path: string): Promise<Buffer> {
        throw new Error("Stub access must be mocked or spied");
    }

    async readdir(path: string): Promise<string[]> {
        throw new Error("Stub access must be mocked or spied");
    }

    async realpath(path: string): Promise<string> {
        throw new Error("Stub access must be mocked or spied");
    }

    async rename(path: string, newPath: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async rmdir(path: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async stat(path: string): Promise<StatInterface> {
        throw new Error("Stub access must be mocked or spied");
    }

    async unlink(path: string): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async writeFile(path: string, content: string | Buffer): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async setModifiedTime(path: string, time: Date): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }

    async truncate(path: string, length: number): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }
    async createReadStream(path: string, chunk_size: number, callback: (arg0: Readable) => Promise<void>): Promise<void> {
        throw new Error("Stub access must be mocked or spied");
    }
}
