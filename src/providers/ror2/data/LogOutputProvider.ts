import ProviderUtils from '../ProviderUtils';

export default abstract class LogOutputProvider {

    static provider: () => LogOutputProvider;
    static provide(provided: () => LogOutputProvider): void {
        this.provider = provided;
    }

    public static get instance(): LogOutputProvider {
        if (LogOutputProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("LogOutputProvider");
        }
        return LogOutputProvider.provider();
    }

    abstract get exists(): boolean;

    abstract set exists(value: boolean);

    public abstract disconnect(): void;

}
