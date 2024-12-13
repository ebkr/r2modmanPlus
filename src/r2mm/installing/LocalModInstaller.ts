import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
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

    public async extractToCacheWithManifestData(profile: ImmutableProfile, zipFile: string, manifest: ManifestV2) {
        const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);
        await ZipExtract.extractOnly(zipFile, cacheDirectory);
        await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
        throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifest, profile));
        throwForR2Error(await ProfileModList.addMod(manifest, profile));
    }

    public async placeFileInCache(profile: ImmutableProfile, file: string, manifest: ManifestV2) {
        try {
            const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);
            const fileSafe = file.split("\\").join("/");
            await FsProvider.instance.copyFile(fileSafe, path.join(cacheDirectory, path.basename(fileSafe)));
        } catch (e) {
            throw R2Error.fromThrownValue(e, "Error moving file to cache");
        }

        await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
        throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifest, profile));
        throwForR2Error(await ProfileModList.addMod(manifest, profile));
    }
}
