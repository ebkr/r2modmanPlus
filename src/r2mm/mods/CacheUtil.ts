import Profile from '../../model/Profile';
import fs from 'fs';
import * as path from 'path';
import ProfileModList from './ProfileModList';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../manager/PathResolver';
import FileUtils from '../../utils/FileUtils';
import ManifestV2 from '../../model/ManifestV2';
import VersionNumber from '../../model/VersionNumber';

export default class CacheUtil {

    public static clean() {
        const profiles: string[] = [];

        // Store profile name to allow returning back to current profile.
        const currentProfileName = Profile.getActiveProfile().getProfileName();
        fs.readdirSync(Profile.getDirectory()).forEach(value => {
            if (fs.lstatSync(path.join(Profile.getDirectory(), value)).isDirectory()) {
                profiles.push(value);
            }
        });

        const activeModSet = new Set<ManifestV2>();
        profiles.forEach(value => {
            const profile = new Profile(value);
            const modList = ProfileModList.getModList(profile);
            if (modList instanceof R2Error) {
                return;
            }
            modList.forEach(value => {
                activeModSet.add(value);
            });
        });

        const cacheDirectory = path.join(PathResolver.ROOT, "mods", "cache");
        fs.readdirSync(cacheDirectory).forEach(folder => {
            if (fs.lstatSync(path.join(cacheDirectory, folder)).isDirectory()) {
                if (this.hasNoVersions(folder, activeModSet)) {
                    // TODO: 310 - Override this with FileUtil usage.
                    FileUtils.emptyDirectory(path.join(cacheDirectory, folder))
                    fs.rmdirSync(path.join(cacheDirectory, folder));
                } else {
                    const versions = this.getVersionsInstalled(folder, activeModSet);
                    fs.readdirSync(path.join(cacheDirectory, folder)).forEach(versionFolder => {
                        const matchingVersion = versions.find(value => value.toString() === versionFolder);
                        if (matchingVersion === undefined) {
                            FileUtils.emptyDirectory(path.join(cacheDirectory, folder, versionFolder));
                            fs.rmdirSync(path.join(cacheDirectory, folder, versionFolder));
                        }
                    })
                }
            }
        })

        // Reset profile
        new Profile(currentProfileName);
    }

    private static hasNoVersions(modName: string, mods: Set<ManifestV2>): boolean {
        return Array.from(mods).filter(value => value.getName() === modName).length === 0;
    }

    public static getVersionsInstalled(modName: string, mods: Set<ManifestV2>): VersionNumber[] {
        return Array.from(mods).filter(value => value.getName() === modName)
            .map(value => value.getVersionNumber());
    }


}
