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

    public abstract writeFileSync(path: string, content: string | Buffer): void;
    public abstract readFileSync(path: string): Buffer;
    public abstract readdirSync(path: string): string[];
    public abstract rmdirSync(path: string): void;
    public abstract mkdirsSync(path: string): void;
    public abstract existsSync(path: string): boolean;
    public abstract unlinkSync(path: string): void;
    public abstract lstatSync(path: string): LstatInterface;
    public abstract renameSync(path: string, newPath: string): void;
    public abstract copyFileSync(from: string, to: string): void;
    public abstract copyFolderSync(from: string, to: string): void;
    public abstract symlinkSync(from: string, to: string, type?: 'junction' | 'dir' | 'file' | null | undefined): void;

}
