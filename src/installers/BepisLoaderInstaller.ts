import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { BepInExInstaller } from './BepInExInstaller';
import ProfileModList from '../r2mm/mods/ProfileModList';
import R2Error from '../model/errors/R2Error';
import FileUtils from '../utils/FileUtils';

export class BepisLoaderInstaller implements PackageInstaller {

    async install(args: InstallArgs) {
        return new BepInExInstaller().install(args);
    }

    async uninstall(args: InstallArgs) {
        /*
        There are two mod loaders for Resonite, and we currently can't guarantee uninstall one without
        uninstalling the other.

        There are scenarios where BepisLoader installs after the BepInEx Renderer package, but in the same install queue.
        This means that it will detect BepisLoader as being currently installed, and since the mod list hasn't been updated yet,
        it reports that the Renderer package isn't installed and attempts to uninstall.
         */
    }

}
