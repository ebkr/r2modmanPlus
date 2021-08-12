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

// Class should be used outside of any ProfileInstallerProvider (besides ComputedProfileInstaller) to prevent duplicate logic.
// EG: BepInEx installer shouldn't have to switch to a MelonLoader installer.
// This is because ProfileInstallerProvider implementations can be swapped, so installer may not be used.
export default class ProfileInstallerResolverImpl extends ProfileInstallerResolverProvider {

    private installers = {
        [PackageLoader.BEPINEX]: new BepInExProfileInstaller(),
        [PackageLoader.MELON_LOADER]: new MelonLoaderProfileInstaller()
    };

    // TODO: Add support for a game to have multiple loaders.
    async determineLoader(game: Game, mod: ManifestV2): Promise<ProfileInstallerProvider> {

        if ((await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, 'cache', mod.getName(), mod.getVersionNumber().toString(), 'mm.meta.json')))) {
            // Placeholder file name.
            // Metadata file can change the loader used to install a mod.
        }

        // Fallback and return default profile installer for game.
        return Promise.resolve(this.installers[game.packageLoader]);
    }

    async getLoader(loader: PackageLoader): Promise<ProfileInstallerProvider> {
        return Promise.resolve(this.installers[loader]);
    }

}
