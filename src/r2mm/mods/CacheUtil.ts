import Profile from '../../model/Profile';
import fs from 'fs';
import * as path from 'path';
import ProfileModList from './ProfileModList';
import R2Error from '../../model/errors/R2Error';
import PathResolver from '../manager/PathResolver';
import FileUtils from '../utils/FileUtils';

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

        const activeModSet = new Set<string>();
        profiles.forEach(value => {
            const profile = new Profile(value);
            const modList = ProfileModList.getModList(profile);
            if (modList instanceof R2Error) {
                return;
            }
            modList.forEach(value => {
                activeModSet.add(value.getName());
            });
        });

        const cacheDirectory = path.join(PathResolver.ROOT, "mods", "cache");
        fs.readdirSync(cacheDirectory).forEach(folder => {
            if (fs.lstatSync(path.join(cacheDirectory, folder)).isDirectory()) {
                if (!activeModSet.has(folder)) {
                    // TODO: 310 - Override this with FileUtil usage.
                    FileUtils.emptyDirectory(path.join(cacheDirectory, folder))
                    fs.rmdirSync(path.join(cacheDirectory, folder));
                }
            }
        })

        // Reset profile
        new Profile(currentProfileName);
    }

}
