import ProviderUtils from '../generic/ProviderUtils';

export default abstract class LinkProvider {

    private static provider: () => LinkProvider;
    static provide(provided: () => LinkProvider): void {
        this.provider = provided;
    }

    public static get instance(): LinkProvider {
        if (LinkProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("LinkProvider");
        }
        return LinkProvider.provider();
    }

    /**
     * Safe URL opening, includes http(s):// only
     *
     * @param url HTTP / HTTPS Only URL
     */
    public abstract openWebOnlyLink(url: string): void;

    /**
     * Unsafe URL opening, includes file://, steam:// and http(s)://
     *
     * @param url URL to open
     */
    public abstract openLink(url: string): void;

    public abstract selectFile(url: string): void;

}
