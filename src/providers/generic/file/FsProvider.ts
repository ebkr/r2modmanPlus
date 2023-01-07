import ProviderUtils from '../ProviderUtils';
import StatInterface from './StatInterface';

export default abstract class FsProvider {

    private static provider: () => FsProvider;
    static provide(provided: () => FsProvider): void {
        this.provider = provided;
    }

    public static get instance(): FsProvider {
        if (FsProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("FsProvider");
        }
        return FsProvider.provider();
    }

    public abstract writeFile(path: string, content: string | Buffer): Promise<void>;
    public abstract readFile(path: string): Promise<Buffer>;
    public abstract readdir(path: string): Promise<string[]>;
    public abstract rmdir(path: string): Promise<void>;
    public abstract mkdirs(path: string): Promise<void>;
    public abstract exists(path: string): Promise<boolean>;
    public abstract unlink(path: string): Promise<void>;
    public abstract stat(path: string): Promise<StatInterface>;
    public abstract lstat(path: string): Promise<StatInterface>;
    public abstract realpath(path: string): Promise<string>;
    public abstract rename(path: string, newPath: string): Promise<void>;
    public abstract chmod(path: string, mode: string | number): Promise<void>;
    public abstract copyFile(from: string, to: string): Promise<void>;
    public abstract copyFolder(from: string, to: string): Promise<void>;
    public abstract base64FromZip(path: string): Promise<string>;
    public abstract setModifiedTime(path: string, time: Date): Promise<void>;

}
