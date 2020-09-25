import ProviderError from '../../../model/errors/ProviderError';

export default class ProfileProvider {

    static provider: () => ProfileProvider;

    static provide(provided: () => ProfileProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileProvider {
        if (ProfileProvider.provider === undefined) {
            throw new ProviderError(
                "ProfileProvider has not been provided",
                "A provider needs to be specified for the ProfileProvider class",
                "Declare the provider in your custom App.vue override"
            );
        }
        return ProfileProvider.provider();
    }

    public ensureProfileDirectory(directory: string, profile: string) {
        throw new ProviderError(
            'Provider does not implement method: ensureProfileDirectory',
            `ProfileProvider (${ProfileProvider.provider().constructor.name}) does not implement ProfileProvider::ensureProfileDirectory`,
            'Override the behaviour of the ensureProfileDirectory method.'
        );
    }

}
