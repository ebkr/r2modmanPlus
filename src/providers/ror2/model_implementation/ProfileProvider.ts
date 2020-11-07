import ProviderUtils from '../../generic/ProviderUtils';

export default abstract class ProfileProvider {

    private static provider: () => ProfileProvider;
    static provide(provided: () => ProfileProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileProvider {
        if (ProfileProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ProfileProvider");
        }
        return ProfileProvider.provider();
    }

    /**
     * Create the profile directory if it doesn't already exist.
     * @param directory
     * @param profile
     */
    public abstract ensureProfileDirectory(directory: string, profile: string): void;

}
