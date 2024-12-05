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

    private async initialiseCacheDirectory(manifest: ManifestV2) {
        const cacheDirectory: string = path.join(PathResolver.MOD_ROOT, 'cache');
        if (await FsProvider.instance.exists(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString()))) {
            await FileUtils.emptyDirectory(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString()));
        } else {
            await FileUtils.ensureDirectory(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString()));
        }
    }

    public async extractToCacheWithManifestData(profile: ImmutableProfile, zipFile: string, manifest: ManifestV2, callback: (success: boolean, error: R2Error | null) => void) {
        const cacheDirectory: string = path.join(PathResolver.MOD_ROOT, 'cache');
        await this.initialiseCacheDirectory(manifest);
        await ZipExtract.extractOnly(
            zipFile,
            path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString()),
            async success => {
                if (success) {
                    if (await FsProvider.instance.exists(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString(), "mm_v2_manifest.json"))) {
                        try {
                            await FsProvider.instance.unlink(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString(), "mm_v2_manifest.json"));
                        } catch (e) {
                            const err: Error = e as Error;
                            callback(false, new R2Error("Failed to unlink manifest from cache", err.message, null));
                        }
                    }
                    await FsProvider.instance.writeFile(path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString(), "mm_v2_manifest.json"), JSON.stringify(manifest));
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
            }
        );
    }

    public async placeFileInCache(profile: ImmutableProfile, file: string, manifest: ManifestV2, callback: (success: boolean, error: (R2Error | null)) => void) {
        try {
            const cacheDirectory: string = path.join(PathResolver.MOD_ROOT, 'cache');
            await this.initialiseCacheDirectory(manifest);
            const modCacheDirectory = path.join(cacheDirectory, manifest.getName(), manifest.getVersionNumber().toString());
            const fileSafe = file.split("\\").join("/");
            await FsProvider.instance.copyFile(fileSafe, path.join(modCacheDirectory, path.basename(fileSafe)));
            await FsProvider.instance.writeFile(path.join(modCacheDirectory, "mm_v2_manifest.json"), JSON.stringify(manifest));
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
