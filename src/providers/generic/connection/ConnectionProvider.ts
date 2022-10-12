import ProviderUtils from '../ProviderUtils';

export default abstract class ConnectionProvider {

    private static provider: () => ConnectionProvider;
    static provide(provided: () => ConnectionProvider): void {
        this.provider = provided;
    }

    public static get instance(): ConnectionProvider {
        if (ConnectionProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ConnectionProvider");
        }
        return ConnectionProvider.provider();
    }

    public abstract getExclusions(downloadProgressed?: (percentDownloaded: number) => void, attempt?: number): Promise<string[]>;

    // TODO: These used to be private, which makes sense since they
    // contain implementation details the Vue components don't need to
    // know about. See if they can be returned back to private once
    // refactoring is done.
    public abstract cleanExclusions(exclusions: string|string[]): string[];
    public abstract getExclusionsFromInternalFile(): string[];
}
