import R2Error from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ZipExtract from './ZipExtract';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import PathResolver from '../manager/PathResolver';
import ProfileModList from '../mods/ProfileModList';
import LocalModInstallerProvider from '../../providers/ror2/installing/LocalModInstallerProvider';
import { ImmutableProfile } from '../../model/Profile';
import FileUtils from '../../utils/FileUtils';

export default class LocalModInstaller extends LocalModInstallerProvider {

    private async initialiseCacheDirectory(manifest: ManifestV2): Promise<string> {
        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache', manifest.getName(), manifest.getVersionNumber().toString());
        if (await FsProvider.instance.exists(cacheDirectory)) {
            await FileUtils.emptyDirectory(cacheDirectory);
        } else {
            await FileUtils.ensureDirectory(cacheDirectory);
        }
        return cacheDirectory;
    }

    public async extractToCacheWithManifestData(profile: ImmutableProfile, zipFile: string, manifest: ManifestV2, callback: (success: boolean, error: R2Error | null) => void) {
        const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);

        try {
            await ZipExtract.extractOnly(zipFile, cacheDirectory);
        } catch (e) {
            callback(false, R2Error.fromThrownValue(e, `Extracting ${zipFile} failed`));
            return;
        }

        await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
        const profileInstallResult = await ProfileInstallerProvider.instance.installMod(manifest, profile);
        if (profileInstallResult instanceof R2Error) {
            callback(false, profileInstallResult);
            return Promise.resolve();
        }
        const modListInstallResult = await ProfileModList.addMod(manifest, profile);
        if (modListInstallResult instanceof R2Error) {
            callback(false, modListInstallResult);
            return Promise.resolve();
        }
        callback(true, null);
        return Promise.resolve();
    }

    public async placeFileInCache(profile: ImmutableProfile, file: string, manifest: ManifestV2, callback: (success: boolean, error: (R2Error | null)) => void) {
        try {
            const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);
            const fileSafe = file.split("\\").join("/");
            await FsProvider.instance.copyFile(fileSafe, path.join(cacheDirectory, path.basename(fileSafe)));
            await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
            const profileInstallResult = await ProfileInstallerProvider.instance.installMod(manifest, profile);
            if (profileInstallResult instanceof R2Error) {
                callback(false, profileInstallResult);
                return Promise.resolve();
            }
            const modListInstallResult = await ProfileModList.addMod(manifest, profile);
            if (modListInstallResult instanceof R2Error) {
                callback(false, modListInstallResult);
                return Promise.resolve();
            }
            callback(true, null);
            return Promise.resolve();
        } catch (e) {
            callback(false, new R2Error("Error moving file to cache", (e as Error).message, null));
        }
    }
}
