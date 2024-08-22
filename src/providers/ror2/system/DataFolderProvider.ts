import ProviderUtils from '../../generic/ProviderUtils';

export abstract class DataFolderProvider {
    public abstract readonly overrideFile: string;

    private static provider: () => DataFolderProvider;

    static provide(provided: () => DataFolderProvider): void {
        this.provider = provided;
    }

    public static get instance(): DataFolderProvider {
        if (DataFolderProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError('DataFolderProvider');
        }
        return DataFolderProvider.provider();
    }

    public abstract showSelectionDialog(): Promise<string|null>;

    public abstract throwForInvalidFolder(folderPath: string): Promise<void>;

    public abstract writeOverrideFile(folderPath: string): Promise<void>;

}
