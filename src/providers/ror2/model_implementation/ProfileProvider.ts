import ProviderError from '../../../model/errors/ProviderError';
import ProviderUtils from '../ProviderUtils';

export default class ProfileProvider {

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

    public ensureProfileDirectory(directory: string, profile: string) {
        throw ProviderUtils.throwMethodError(ProfileProvider.instance, this.constructor.name, "ensureProfileDirectory");
    }

}
