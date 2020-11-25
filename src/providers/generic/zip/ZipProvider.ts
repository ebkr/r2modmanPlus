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

    public abstract async extractAllTo(zip: string | Buffer, outputFolder: string): Promise<void>;

    public abstract async readFile(zip: string | Buffer, file: string): Promise<Buffer | null>;

    public abstract async getEntries(zip: string | Buffer): Promise<ZipEntryInterface[]>;

    public abstract async extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void>;

    public abstract zipBuilder(): ZipBuilder;

}

