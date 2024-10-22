import Profile from '../../model/Profile';
import * as path from 'path';
import ProfileModList from './ProfileModList';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../manager/PathResolver';
import FileUtils from '../../utils/FileUtils';
import ManifestV2 from '../../model/ManifestV2';
import VersionNumber from '../../model/VersionNumber';
import FsProvider from '../../providers/generic/file/FsProvider';

export default class CacheUtil {

    public static async clean() {
        const profiles: string[] = [];
        const originalProfile = Profile.getActiveProfile();

        const fs = FsProvider.instance;

        // Store profile name to allow returning back to current profile.
        fs.readdir(Profile.getRootDir()).then(async dir => {
            for (const value of dir) {
                if ((await fs.stat(path.join(Profile.getRootDir(), value))).isDirectory()) {
                    profiles.push(value);
                }
            }
        }).then(async () => {
            const activeModSet = new Set<ManifestV2>();
            for (const value of profiles) {
                const profile = new Profile(value);
                const modList = await ProfileModList.getModList(profile.asImmutableProfile());
                if (modList instanceof R2Error) {
                    continue;
                }
                modList.forEach(value => {
                    activeModSet.add(value);
                });
            }

            // Go back to original profile
            new Profile(originalProfile.getProfileName());

            const cacheDirectory = path.join(PathResolver.MOD_ROOT, "cache");
            await FileUtils.ensureDirectory(cacheDirectory);
            for (const folder of (await fs.readdir(cacheDirectory))) {
                if ((await fs.stat(path.join(cacheDirectory, folder))).isDirectory()) {
                    if (this.hasNoVersions(folder, activeModSet)) {
                        await FileUtils.emptyDirectory(path.join(cacheDirectory, folder))
                        await fs.rmdir(path.join(cacheDirectory, folder));
                    } else {
                        const versions = this.getVersionsInstalled(folder, activeModSet);
                        for (const versionFolder of (await fs.readdir(path.join(cacheDirectory, folder)))) {
                            const matchingVersion = versions.find(value => value.toString() === versionFolder);
                            if (matchingVersion === undefined) {
                                try {
                                    await FileUtils.emptyDirectory(path.join(cacheDirectory, folder, versionFolder));
                                    await fs.rmdir(path.join(cacheDirectory, folder, versionFolder));
                                } catch (e) {
                                    // An error occurred when deleting the directory. Unknown cause as folder is visually empty.
                                    // Calling fs.rmdirSync does however solve this issue, so unsure why this is an issue.
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    private static hasNoVersions(modName: string, mods: Set<ManifestV2>): boolean {
        return Array.from(mods).filter(value => value.getName() === modName).length === 0;
    }

    public static getVersionsInstalled(modName: string, mods: Set<ManifestV2>): VersionNumber[] {
        return Array.from(mods).filter(value => value.getName() === modName)
            .map(value => value.getVersionNumber());
    }


}
