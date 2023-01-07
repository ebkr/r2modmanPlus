import ProviderUtils from '../../generic/ProviderUtils';

export default abstract class LoggerProvider {

    private static provider: () => LoggerProvider;

    static provide(provided: () => LoggerProvider): void {
        this.provider = provided;
    }

    public static get instance(): LoggerProvider {
        if (LoggerProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError('LoggerProvider');
        }
        return LoggerProvider.provider();
    }

    /**
     * Add an error to the r2modman log.
     *
     * @param severity
     * @param error
     */
    public abstract Log(severity: LogSeverity, error: string): void;

    /**
     * Write the log to a file.
     */
    abstract Write(): void;

}

/**
 * Levels of logging.
 */
export enum LogSeverity {
    ACTION_STOPPED = 'ACTION_STOPPED',
    BREAKING = 'BREAKING',
    INFO = 'INFO',
    ERROR = 'ERROR'
}
