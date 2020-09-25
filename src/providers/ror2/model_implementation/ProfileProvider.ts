import ProviderUtils from '../ProviderUtils';

export default abstract class ProfileProvider {

    static provider: () => ProfileProvider;

    static provide(provided: () => ProfileProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileProvider {
        if (ProfileProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ProfileProvider");
        }
        return ProfileProvider.provider();
    }

    public abstract ensureProfileDirectory(directory: string, profile: string): void;

}
