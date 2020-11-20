import ProviderUtils from '../ProviderUtils';
import LstatInterface from './LstatInterface';

export default abstract class FsProvider {

    private static provider: () => FsProvider;
    static provide(provided: () => FsProvider): void {
        this.provider = provided;
    }

    public static get instance(): FsProvider {
        if (FsProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("FsProvider");
        }
        return FsProvider.provider();
    }

    public abstract async writeFile(path: string, content: string | Buffer): Promise<void>;
    public abstract async readFile(path: string): Promise<Buffer>;
    public abstract async readdir(path: string): Promise<string[]>;
    public abstract async rmdir(path: string): Promise<void>;
    public abstract async mkdirs(path: string): Promise<void>;
    public abstract async exists(path: string): Promise<boolean>;
    public abstract async unlink(path: string): Promise<void>;
    public abstract async lstat(path: string): Promise<LstatInterface>;
    public abstract async rename(path: string, newPath: string): Promise<void>;
    public abstract async copyFile(from: string, to: string): Promise<void>;
    public abstract async copyFolder(from: string, to: string): Promise<void>;

}
