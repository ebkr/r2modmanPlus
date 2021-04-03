import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ZipExtract from './ZipExtract';
import * as path from "path";
import FsProvider from '../../providers/generic/file/FsProvider';
import PathResolver from '../manager/PathResolver';
import ProfileModList from '../mods/ProfileModList';
import LocalModInstallerProvider from '../../providers/ror2/installing/LocalModInstallerProvider';
import ZipProvider from '../../providers/generic/zip/ZipProvider';
import Profile from 'src/model/Profile';

export default class LocalModInstaller extends LocalModInstallerProvider {

    public async extractToCache(profile: Profile, zipFile: string, callback: (success: boolean, error: R2Error | null) => void): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const zipFileBuffer = await fs.readFile(zipFile);
        const result: Buffer | null = await ZipProvider.instance.readFile(zipFileBuffer,'manifest.json');
        if (result !== null) {
            const fileContents = result.toString();
            try {
                const parsed = JSON.parse(fileContents.trim());
                const mod: R2Error | ManifestV2 = new ManifestV2().makeSafe(parsed);
                if (mod instanceof R2Error) {
                    return mod;
                }
                const cacheDirectory: string = path.join(PathResolver.MOD_ROOT, 'cache');
                await ZipExtract.extractOnly(
                    zipFile,
                    path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString()),
                    async success => {
                        if (success) {
                            const profileInstallResult = await ProfileInstallerProvider.instance.installMod(mod, profile);
                            if (profileInstallResult instanceof R2Error) {
                                callback(false, profileInstallResult);
                                return Promise.resolve();
                            }
                            const modListInstallResult = await ProfileModList.addMod(mod, profile);
                            if (modListInstallResult instanceof R2Error) {
                                callback(false, modListInstallResult);
                                return Promise.resolve();
                            }
                            callback(true, null);
                            return Promise.resolve();
                        }
                    }
                );
            } catch(e) {
                const err: Error = e;
                return new R2Error('Failed to convert manifest to JSON', err.message, null);
            }
        } else {
            return new R2Error('No manifest provided', 'No file found in zip with name "manifest.json". Contact the mod author, or create your own.', null);
        }
        return Promise.resolve();
    }

}
