import ProviderUtils from '../ProviderUtils';

export default abstract class GameImageProvider {

    private static provider: () => GameImageProvider;
    static provide(provided: () => GameImageProvider): void {
        this.provider = provided;
    }

    public static get instance(): GameImageProvider {
        if (GameImageProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("GameImageProvider");
        }
        return GameImageProvider.provider();
    }

    public abstract init(): Promise<void>;

    public abstract get placeholderUrl(): string;

    public abstract resolve(iconUrl: string): Promise<string>;

}
