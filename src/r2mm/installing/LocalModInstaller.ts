import AdmZip from 'adm-zip';
import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import InvalidManifestError from '../../model/errors/Manifest/InvalidManifestError';
import ProfileInstaller from './ProfileInstaller';
import ZipExtract from './ZipExtract';
import path from "path";
import PathResolver from '../manager/PathResolver';
import ProfileModList from '../mods/ProfileModList';

export default class LocalModInstaller {

    public static extractToCache(zipFile: string, callback: (success: boolean, error: R2Error | null) => void): R2Error | void {
        const zip = new AdmZip(zipFile);
        const result: Buffer | null = zip.readFile('manifest.json');
        if (result !== null) {
            const fileContents = result.toString();
            try {
                const parsed = JSON.parse(fileContents);
                const mod: R2Error | ManifestV2 = new ManifestV2().makeSafe(parsed);
                if (mod instanceof R2Error) {
                    return mod;
                }
                const cacheDirectory: string = path.join(PathResolver.ROOT, 'games', 'Risk of Rain 2', 'cache');
                ZipExtract.extractOnly(
                    zipFile,
                    path.join(cacheDirectory, mod.getName(), mod.getVersionNumber().toString()),
                    success => {
                        if (success) {
                            const profileInstallResult = ProfileInstaller.installMod(mod);
                            if (profileInstallResult instanceof R2Error) {
                                callback(false, profileInstallResult);
                                return;
                            }
                            const modListInstallResult = ProfileModList.addMod(mod);
                            if (modListInstallResult instanceof R2Error) {
                                callback(false, modListInstallResult);
                            }
                            callback(true, null);
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
    }

}
