import ProviderUtils from '../../generic/ProviderUtils';

export default abstract class LogOutputProvider {

    private static provider: () => LogOutputProvider;
    static provide(provided: () => LogOutputProvider): void {
        this.provider = provided;
    }

    public static get instance(): LogOutputProvider {
        if (LogOutputProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("LogOutputProvider");
        }
        return LogOutputProvider.provider();
    }

    /**
     * Return the boolean existence of the LogOutput.log file within the <profile>/BepInEx folder.
     * @return true if exists.
     */
    abstract get exists(): boolean;

    /**
     * Forcefully set the boolean existence of the LogOutput.log.
     * @param value
     */
    abstract set exists(value: boolean);

    /**
     * Disconnect the interval timer if in use.
     */
    public abstract disconnect(): void;

}
