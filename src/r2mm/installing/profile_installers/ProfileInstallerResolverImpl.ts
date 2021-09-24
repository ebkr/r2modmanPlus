import ProfileInstallerResolverProvider from '../../../providers/generic/installing/ProfileInstallerResolverProvider';
import ManifestV2 from '../../../model/ManifestV2';
import Game from '../../../model/game/Game';
import { PackageLoader } from '../../../model/installing/PackageLoader';
import BepInExProfileInstaller from './BepInExProfileInstaller';
import MelonLoaderProfileInstaller from './MelonLoaderProfileInstaller';
import ProfileInstallerProvider from '../../../providers/ror2/installing/ProfileInstallerProvider';
import FsProvider from '../../../providers/generic/file/FsProvider';
import PathResolver from '../../manager/PathResolver';
import * as path from 'path';
import InstallationRules from '../../installing/InstallationRules';
import InstallRules_RiskOfRain2 from '../../installing/default_installation_rules/game_rules/InstallRules_RiskOfRain2';
import InstallRules_BONEWORKS from '../../installing/default_installation_rules/game_rules/InstallRules_BONEWORKS';

// Class should be used outside of any ProfileInstallerProvider (besides ComputedProfileInstaller) to prevent duplicate logic.
// EG: BepInEx installer shouldn't have to switch to a MelonLoader installer.
// This is because ProfileInstallerProvider implementations can be swapped, so installer may not be used.
export default class ProfileInstallerResolverImpl extends ProfileInstallerResolverProvider {

    // TODO: Add support for a game to have multiple loaders.
    async determineLoader(game: Game, mod: ManifestV2): Promise<ProfileInstallerProvider> {

        if ((await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, 'cache', mod.getName(), mod.getVersionNumber().toString(), 'mm.meta.json')))) {
            // Placeholder file name.
            // Metadata file can change the loader used to install a mod.
        }

        // Fallback and return default profile installer for game.
        const installRule = InstallationRules.RULES.find(value => value.gameName === game.internalFolderName);
        if (installRule === undefined) {
            throw new Error(`No rules for game: ${game.internalFolderName}`);
        }
        switch (installRule.packageLoader) {
            case PackageLoader.BEPINEX: return Promise.resolve(new BepInExProfileInstaller(installRule));
            case PackageLoader.MELON_LOADER: return Promise.resolve(new MelonLoaderProfileInstaller(installRule));
        }
    }

    async getLoader(loader: PackageLoader): Promise<ProfileInstallerProvider> {
        switch (loader) {
            case PackageLoader.BEPINEX: return Promise.resolve(new BepInExProfileInstaller(InstallRules_RiskOfRain2()));
            case PackageLoader.MELON_LOADER: return Promise.resolve(new MelonLoaderProfileInstaller(InstallRules_BONEWORKS()));
        }
    }

}
