import ProviderUtils from '../generic/ProviderUtils';

export default abstract class LinkProvider {

    private static provider: () => LinkProvider;
    static provide(provided: () => LinkProvider): void {
        this.provider = provided;
    }

    public static get instance(): LinkProvider {
        if (LinkProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("LinkProvider");
        }
        return LinkProvider.provider();
    }

    public abstract openLink(url: string): void;

    public abstract selectFile(url: string): void;

}
