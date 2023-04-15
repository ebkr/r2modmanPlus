import Profile from '../model/Profile';
import FsProvider from '../providers/generic/file/FsProvider';
import * as path from 'path';

export async function getUnityDoorstopVersion(profile: Profile): Promise<number> {
    if (await FsProvider.instance.exists(path.join(profile.getPathOfProfile(), ".doorstop_version"))) {
        const dvContent = (await FsProvider.instance.readFile(path.join(profile.getPathOfProfile(), ".doorstop_version"))).toString();
        const majorVersion = Number(dvContent.split(".")[0]);
        if (majorVersion && majorVersion > 3) {
            return majorVersion;
        }
    }
    return 3;
}
