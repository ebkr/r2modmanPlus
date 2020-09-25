import ProviderUtils from '../ProviderUtils';

export default class LogOutputProvider {

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

    get exists(): boolean {
        throw ProviderUtils.throwGetterError(LogOutputProvider.instance, this.constructor.name, "exists");
    }


    set exists(value: boolean) {
        throw ProviderUtils.throwSetterError(LogOutputProvider.instance, this.constructor.name, "exists");
    }

    public disconnect() {
        throw ProviderUtils.throwMethodError(LogOutputProvider.instance, this.constructor.name, "disconnect");
    }

}
