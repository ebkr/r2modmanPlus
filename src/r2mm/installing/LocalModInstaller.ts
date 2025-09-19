import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
import ManifestV2 from '../../model/ManifestV2';
import ProfileInstallerProvider from '../../providers/ror2/installing/ProfileInstallerProvider';
import ZipExtract from './ZipExtract';
import FsProvider from '../../providers/generic/file/FsProvider';
import PathResolver from '../manager/PathResolver';
import ProfileModList from '../mods/ProfileModList';
import LocalModInstallerProvider from '../../providers/ror2/installing/LocalModInstallerProvider';
import { ImmutableProfile } from '../../model/Profile';
import FileUtils from '../../utils/FileUtils';
import path from '../../providers/node/path/path';

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

    /**
     * Store custom file into cache to indicate the mod is installed locally.
     * When the mod is installed, the file also gets copied to profile, which can
     * be used in troubleshooting, telling us that the version of the mod isn't
     * necessarily the same that's available via Thunderstore API.
     */
    private async writeCustomManifestToCache(cacheDirectory: string, manifest: ManifestV2) {
        const manifestPath: string = path.join(cacheDirectory, 'mm_v2_manifest.json');

        if (await FsProvider.instance.exists(manifestPath)) {
            try {
                await FsProvider.instance.unlink(manifestPath);
            } catch (e) {
                throw R2Error.fromThrownValue(e, 'Failed to unlink manifest from cache');
            }
        }

        await FsProvider.instance.writeFile(manifestPath, JSON.stringify(manifest));
    }

    /**
     * Write Thunderstore compatible manifest.json to cache if one wasn't provided
     * with the upload. This is done to have consistency between all installed
     * mods, regardless of how they were installed. Having the manifest present
     * allows e.g. other mods to sniff out what other mods are installed.
     */
    private async writeManifestToCache(cacheDirectory: string, manifest: ManifestV2) {
        const manifestPath: string = path.join(cacheDirectory, 'manifest.json');

        if (!(await FsProvider.instance.exists(manifestPath))) {
            const content = {
                'name': manifest.getDisplayName(),  // getName() returns "author-modname" here
                'description': manifest.getDescription(),
                'version_number': manifest.getVersionNumber().toString(),
                'dependencies': manifest.getDependencies(),
                'website_url': ''
            };

            await FsProvider.instance.writeFile(manifestPath, JSON.stringify(content, null, 4));
        }
    }

    public async extractToCacheWithManifestData(profile: ImmutableProfile, zipFile: string, manifest: ManifestV2) {
        const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);
        await ZipExtract.extractOnly(zipFile, cacheDirectory);
        await this.writeManifestToCache(cacheDirectory, manifest);
        await this.writeCustomManifestToCache(cacheDirectory, manifest);
        await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
        throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifest, profile));
        throwForR2Error(await ProfileModList.addMod(manifest, profile));
    }

    public async placeFileInCache(profile: ImmutableProfile, file: string, manifest: ManifestV2) {
        try {
            const cacheDirectory: string = await this.initialiseCacheDirectory(manifest);
            const fileSafe = file.split("\\").join("/");
            await FsProvider.instance.copyFile(fileSafe, path.join(cacheDirectory, path.basename(fileSafe)));
            await this.writeManifestToCache(cacheDirectory, manifest);
            await this.writeCustomManifestToCache(cacheDirectory, manifest);
        } catch (e) {
            throw R2Error.fromThrownValue(e, "Error moving file to cache");
        }

        await ProfileInstallerProvider.instance.uninstallMod(manifest, profile);
        throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifest, profile));
        throwForR2Error(await ProfileModList.addMod(manifest, profile));
    }
}
