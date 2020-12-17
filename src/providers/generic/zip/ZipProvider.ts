import ProviderUtils from '../ProviderUtils';
import ZipBuilder from './ZipBuilder';
import ZipEntryInterface from './ZipEntryInterface';

export default abstract class ZipProvider {

    private static provider: () => ZipProvider;
    static provide(provided: () => ZipProvider): void {
        this.provider = provided;
    }

    public static get instance(): ZipProvider {
        if (ZipProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ZipProvider");
        }
        return ZipProvider.provider();
    }

    public abstract extractAllTo(zip: string | Buffer, outputFolder: string): Promise<void>;

    public abstract readFile(zip: string | Buffer, file: string): Promise<Buffer | null>;

    public abstract getEntries(zip: string | Buffer): Promise<ZipEntryInterface[]>;

    public abstract extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void>;

    public abstract zipBuilder(): ZipBuilder;

}

