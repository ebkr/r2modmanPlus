import { getInstallArgs, PackageInstaller } from "../../../installers/PackageInstaller";
import { PackageLoaderInstallers, PluginInstallers } from "../../../installers/registry";
import R2Error from '../../../model/errors/R2Error';
import GameManager from '../../../model/game/GameManager';
import ManifestV2 from '../../../model/ManifestV2';
import { ImmutableProfile } from '../../../model/Profile';
import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import { MOD_LOADER_VARIANTS } from '../../installing/profile_installers/ModLoaderVariantRecord';


export default class GenericProfileInstaller extends ProfileInstallerProvider {
    private readonly modLoaderInstaller: PackageInstaller;
    private readonly pluginInstaller: PackageInstaller;

    constructor() {
        super();
        const loader = GameManager.activeGame.packageLoader;
        this.modLoaderInstaller = PackageLoaderInstallers[loader];
        this.pluginInstaller = PluginInstallers[loader];
    }

    private isModLoader(mod: ManifestV2): boolean {
        const modLoaders = MOD_LOADER_VARIANTS[GameManager.activeGame.internalFolderName] ?? [];
        return modLoaders.some(loader => loader.packageName.toLowerCase() === mod.getName().toLowerCase());
    }

    private getInstallerForPackage(mod: ManifestV2): PackageInstaller {
        return this.isModLoader(mod) ? this.modLoaderInstaller : this.pluginInstaller;
    }

    async disableMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | void> {
        try {
            // Mod loaders don't support disabling.
            if (this.isModLoader(mod)) {
                return;
            }

            if (this.pluginInstaller.disable === undefined) {
                throw new Error(`Plugin installer for ${GameManager.activeGame.packageLoader} doesn't implement disable()`);
            }

            const args = getInstallArgs(mod, profile);
            await this.pluginInstaller.disable(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }
    }

    async enableMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | void> {
        try {
            // Mod loaders don't support enabling.
            if (this.isModLoader(mod)) {
                return;
            }

            if (this.pluginInstaller.enable === undefined) {
                throw new Error(`Plugin installer for ${GameManager.activeGame.packageLoader} doesn't implement enable()`);
            }

            const args = getInstallArgs(mod, profile);
            await this.pluginInstaller.enable(args);
        } catch (e) {
            console.error(e);
            return R2Error.fromThrownValue(e);
        }
    }

    async installMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | null> {
        try {
            const installer = this.getInstallerForPackage(mod);
            const args = getInstallArgs(mod, profile);
            await installer.install(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }

        return null;
    }

    async uninstallMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | null> {
        try {
            const installer = this.getInstallerForPackage(mod);
            const args = getInstallArgs(mod, profile);
            await installer.uninstall(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }

        return null;
    }
}
