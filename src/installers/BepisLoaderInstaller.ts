import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { BepInExInstaller } from 'src/installers/BepInExInstaller';

export class BepisLoaderInstaller implements PackageInstaller {

    async install(args: InstallArgs) {
        return new BepInExInstaller().install(args);
    }

    async uninstall(args: InstallArgs) {
        /*
        Do nothing on uninstall as BepisLoader for Resonite currently has two mod loaders. Both are required and so
        uninstalling one / installing one after another would leave us in a broken state.
         */
        return;
    }

}
