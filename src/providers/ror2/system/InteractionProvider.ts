import ProviderUtils from '../../generic/ProviderUtils';

export default abstract class InteractionProvider {

    private static provider: () => InteractionProvider;

    static provide(provided: () => InteractionProvider): void {
        this.provider = provided;
    }

    public static get instance(): InteractionProvider {
        if (InteractionProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError('InteractionProvider');
        }
        return InteractionProvider.provider();
    }

    public abstract async selectFolder(options: InteractionProviderFolderProperties): Promise<string[]>;

    public abstract async selectFile(options: InteractionProviderFileProperties): Promise<string[]>;

    public abstract restartApp(): void;

    public abstract hookModInstallProtocol(callback: (data: any) => void): void;

    public abstract copyToClipboard(value: string): void;

}

export interface InteractionProviderFolderProperties {

    title: string,
    defaultPath: string,
    buttonLabel: string

}

export interface InteractionProviderFileProperties {

    title: string,
    buttonLabel: string,
    filters: string[]

}
