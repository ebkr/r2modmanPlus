import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import { BepInExInstaller } from './BepInExInstaller';
import ProfileModList from 'src/r2mm/mods/ProfileModList';
import R2Error from 'src/model/errors/R2Error';
import FileUtils from 'src/utils/FileUtils';
import FsProvider from 'src/providers/generic/file/FsProvider';

export class BepisLoaderInstaller implements PackageInstaller {

    async install(args: InstallArgs) {
        return new BepInExInstaller().install(args);
    }

    async uninstall(args: InstallArgs) {
        /*
        Resonite deals with two mod loaders. As it's currently the only game using BepisLoader, for now we'll hard-code
        mod loader packages and we'll remove the appropriate folders. We'll only remove the renderer for now.
         */
        const { profile } = args;
        const modList = await ProfileModList.getModList(profile);
        if (modList instanceof R2Error) {
            throw modList;
        }

        const hasRendererModLoaderInstalled = modList.findIndex(value => value.getName() === 'ResoniteModding-BepInExRenderer') >= 0;
        if (!hasRendererModLoaderInstalled) {
            const rendererPath = profile.joinToProfilePath('Renderer');
            await FileUtils.ensureDirectory(rendererPath);
            await FileUtils.emptyDirectory(rendererPath);
            await FsProvider.instance.rmdir(rendererPath);
        }
        return;
    }

}
