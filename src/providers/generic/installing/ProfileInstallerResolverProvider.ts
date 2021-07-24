import ProfileInstallerProvider from '../../ror2/installing/ProfileInstallerProvider';
import ProviderUtils from '../../generic/ProviderUtils';
import ManifestV2 from '../../../model/ManifestV2';
import Game from '../../../model/game/Game';
import { PackageLoader } from '../../../model/installing/PackageLoader';

export default abstract class ProfileInstallerResolverProvider {

    private static provider: () => ProfileInstallerResolverProvider;

    static provide(provided: () => ProfileInstallerResolverProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileInstallerResolverProvider {
        if (ProfileInstallerResolverProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ProfileInstallerResolverProvider");
        }
        return ProfileInstallerResolverProvider.provider();
    }

    public abstract determineLoader(game: Game, mod: ManifestV2): Promise<ProfileInstallerProvider>;

    public abstract getLoader(loader: PackageLoader): Promise<ProfileInstallerProvider>;

}

