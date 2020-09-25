import ProviderUtils from '../ProviderUtils';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import BepInExTree from '../../../model/file/BepInExTree';

export default abstract class ProfileInstallerProvider {

    static provider: () => ProfileInstallerProvider;

    static provide(provided: () => ProfileInstallerProvider): void {
        this.provider = provided;
    }

    public static get instance(): ProfileInstallerProvider {
        if (ProfileInstallerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError('ProfileInstallerProvider');
        }
        return ProfileInstallerProvider.provider();
    }

    public abstract uninstallMod(mod: ManifestV2): R2Error | null;

    public abstract disableMod(mod: ManifestV2): R2Error | void;

    public abstract enableMod(mod: ManifestV2): R2Error | void;

    public abstract installMod(mod: ManifestV2): R2Error | null;

    abstract applyModMode(mod: ManifestV2, tree: BepInExTree, location: string, mode: number): R2Error | void;

    abstract getDescendantFiles(tree: BepInExTree | null, location: string): string[];

    abstract installForManifestV2(mod: ManifestV2, location: string): R2Error | null;

    abstract resolveBepInExTree(location: string, folderName: string, mod: ManifestV2, tree: BepInExTree): R2Error | null;

    abstract installBepInEx(bieLocation: string): R2Error | null;

}
