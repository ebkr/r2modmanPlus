import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import ManifestV2 from '../../../model/ManifestV2';
import { ImmutableProfile } from '../../../model/Profile';
import R2Error, { throwForR2Error } from '../../../model/errors/R2Error';
import ModLoaderPackageMapping from '../../../model/installing/ModLoaderPackageMapping';
import path from "../../../providers/node/path/path";
import FsProvider from '../../../providers/generic/file/FsProvider';
import InstallationRules, { CoreRuleType } from '../../installing/InstallationRules';
import PathResolver from '../../../r2mm/manager/PathResolver';
import GameManager from '../../../model/game/GameManager';
import { MOD_LOADER_VARIANTS } from '../../installing/profile_installers/ModLoaderVariantRecord';
import FileWriteError from '../../../model/errors/FileWriteError';
import { getPluginInstaller, PackageLoaderInstallers } from "../../../installers/registry";
import { InstallArgs, PackageInstaller } from "../../../installers/PackageInstaller";
import { InstallRulePluginInstaller } from "../../../installers/InstallRulePluginInstaller";


export default class GenericProfileInstaller extends ProfileInstallerProvider {

    private readonly rule: CoreRuleType | undefined;
    private readonly legacyInstaller: InstallRulePluginInstaller;

    constructor() {
        super();
        this.rule = InstallationRules.RULES.find(value => value.gameName === GameManager.activeGame.internalFolderName)!;
        this.legacyInstaller = new InstallRulePluginInstaller(this.rule);
    }

    async disableMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | void> {
        // Support for installer specific disable methods are rolled out
        // gradually and therefore might not be defined yet. Disabling
        // mod loader packages are intentionally not supported.
        try {
            if (await this.disableModWithInstaller(mod, profile)) {
                return;
            }

            const args = this.getInstallArgs(mod, profile);
            await this.legacyInstaller.disable(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }
    }

    async enableMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | void> {
        // Support for installer specific enable methods are rolled out
        // gradually and therefore might not be defined yet. Enabling
        // mod loader packages are intentionally not supported.
        try {
            if (await this.enableModWithInstaller(mod, profile)) {
                return;
            }

            const args = this.getInstallArgs(mod, profile);
            await this.legacyInstaller.enable(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }
    }

    async installForManifestV2(args: InstallArgs): Promise<R2Error | null> {
        try {
            await this.legacyInstaller.install(args);
            return null;
        } catch (e) {
            console.error(e);
            return R2Error.fromThrownValue(e);
        }
    }

    async installMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | null> {
        const args = this.getInstallArgs(mod, profile);

        // Installation logic for mod loaders.
        const modLoader = this.getModLoader(mod);

        if (modLoader !== undefined) {
            return this.installModLoader(modLoader, args);
        }

        // Installation logic for mods for games that use "plugins",
        // i.e. the newer approach for defining installation logic.
        const pluginInstaller = getPluginInstaller(GameManager.activeGame.packageLoader);

        if (pluginInstaller !== null) {
            try {
                await pluginInstaller.install(args);
                return Promise.resolve(null);
            } catch (e) {
                return Promise.resolve(R2Error.fromThrownValue(e));
            }
        }

        // Revert to legacy install behavior.
        return this.installForManifestV2(args);
    }

    private getInstallArgs(mod: ManifestV2, profile: ImmutableProfile): InstallArgs {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const packagePath = path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString());
        return {mod, profile, packagePath};
    }

    private getModLoader(mod: ManifestV2): ModLoaderPackageMapping|undefined {
        const modLoaders = MOD_LOADER_VARIANTS[GameManager.activeGame.internalFolderName];
        return modLoaders.find(loader => loader.packageName.toLowerCase() === mod.getName().toLowerCase());
    }

    async installModLoader(mapping: ModLoaderPackageMapping, args: InstallArgs): Promise<R2Error | null> {
        await PackageLoaderInstallers[mapping.loaderType].install(args);
        return null;
    }

    private async uninstallModLoader(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | null> {
        const activeGame = GameManager.activeGame;
        const fs = FsProvider.instance;

        const modLoaders = MOD_LOADER_VARIANTS[activeGame.internalFolderName];
        if (modLoaders.find(loader => loader.packageName.toLowerCase() === mod.getName().toLowerCase())) {
            try {
                for (const file of (await fs.readdir(profile.getProfilePath()))) {
                    if (file.toLowerCase() === 'mods.yml') {
                        continue;
                    }
                    const filePath = profile.joinToProfilePath(file);
                    if ((await fs.lstat(filePath)).isFile()) {
                        await fs.unlink(filePath);
                    }
                }
            } catch(e) {
                const name = 'Failed to delete mod loader files from profile root';
                const solution = 'Is the game still running?';
                return FileWriteError.fromThrownValue(e, name, solution);
            }
        }

        return null;
    }

    async uninstallMod(mod: ManifestV2, profile: ImmutableProfile): Promise<R2Error | null> {
        // Support for installer specific uninstall methods are rolled out
        // gradually and therefore might not be defined yet.
        try {
            if (
                await this.uninstallModLoaderWithInstaller(mod, profile) ||
                await this.uninstallModWithInstaller(mod, profile)
            ) {
                return null;
            }

            // Fallback to legacy uninstallation.
            throwForR2Error(await this.uninstallModLoader(mod, profile));
            const args = this.getInstallArgs(mod, profile);
            await this.legacyInstaller.uninstall(args);
        } catch (e) {
            return R2Error.fromThrownValue(e);
        }
        return null;
    }

    /**
     * Uninstall mod if it's a registered mod loader and the installer class
     * implements a custom uninstallation method.
     * @return true if mod loader was uninstalled
     */
    private async uninstallModLoaderWithInstaller(mod: ManifestV2, profile: ImmutableProfile): Promise<boolean> {
        const modLoader = this.getModLoader(mod);
        const installer = modLoader ? PackageLoaderInstallers[modLoader.loaderType] : null;
        return this.uninstallWithInstaller(installer, mod, profile);
    }

    /**
     * Uninstall mod if its registered installer implements a custom
     * uninstallation method.
     * @return true if mod was uninstalled
     */
    private async uninstallModWithInstaller(mod: ManifestV2, profile: ImmutableProfile): Promise<boolean> {
        const installer = getPluginInstaller(GameManager.activeGame.packageLoader);
        return this.uninstallWithInstaller(installer, mod, profile);
    }

    private async uninstallWithInstaller(
        installer: PackageInstaller | null,
        mod: ManifestV2,
        profile: ImmutableProfile
    ): Promise<boolean> {
        if (installer && installer.uninstall) {
            const args = this.getInstallArgs(mod, profile);
            await installer.uninstall(args);
            return true;
        }

        return false;
    }

    /**
     * Enable mod if its registered installer implements a custom
     * enable method.
     * @return true if mod was enable
     */
    private async enableModWithInstaller(mod: ManifestV2, profile: ImmutableProfile): Promise<boolean> {
        const modLoader = this.getModLoader(mod);

        if (modLoader) {
            return false;  // Don't process mod loader with plugin installer.
        }

        const installer = getPluginInstaller(GameManager.activeGame.packageLoader);

        if (installer && installer.enable) {
            const args = this.getInstallArgs(mod, profile);
            await installer.enable(args);
            return true;
        }

        return false;
    }

    /**
     * Disable mod if its registered installer implements a custom
     * disable method.
     * @return true if mod was disabled
     */
    private async disableModWithInstaller(mod: ManifestV2, profile: ImmutableProfile): Promise<boolean> {
        const modLoader = this.getModLoader(mod);

        if (modLoader) {
            return false;  // Don't process mod loader with plugin installer.
        }

        const installer = getPluginInstaller(GameManager.activeGame.packageLoader);

        if (installer && installer.disable) {
            const args = this.getInstallArgs(mod, profile);
            await installer.disable(args);
            return true;
        }

        return false;
    }
}
