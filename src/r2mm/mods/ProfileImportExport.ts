import FileUtils from '../../utils/FileUtils';
import path from 'path';
import PathResolver from '../../r2mm/manager/PathResolver';
import FsProvider from '../../providers/generic/file/FsProvider';
import { ProfileApiClient } from '../../r2mm/profiles/ProfilesClient';

const IMPORT_CACHE_DIRNAME = "_import_cache";
const PROFILE_DATA_PREFIX = "#r2modman";

const getImportCacheDir = async (): Promise<string> => {
    const dir = path.join(PathResolver.ROOT, IMPORT_CACHE_DIRNAME);
    await FileUtils.ensureDirectory(dir);
    return dir;
}

const getDownloadDestination = async (): Promise<string> => {
    const cacheDir = await getImportCacheDir();
    // TODO: This really should always generate an unique filename in order to
    //       ensure there are no conflicts for if for some reason multiple
    //       imports are happening at the same time. Achieving uniqueness
    //       is simple enough, but it shouldn't be done without a cleanup
    //       strategy to avoid bloating the user's system. A cleanup strategy
    //       on the other hand turns out to be non-trivial, and as such
    //       a fixed filename is currently used.
    return path.join(cacheDir, "import.r2z");
}


const B64_REGEX = /[A-Za-z0-9+/=]/;

const isValidBase64 = (profileData: string): boolean => {
    return B64_REGEX.test(profileData);
}

const normalizeProfileData = (profileData: string): string => {
    if (profileData.startsWith(PROFILE_DATA_PREFIX)) {
        profileData = profileData.substring(PROFILE_DATA_PREFIX.length).trim();
    }
    if (!isValidBase64(profileData)) {
        throw new Error("Invalid profile data");
    }
    return profileData;
}

async function saveDownloadedProfile(profileData: string): Promise<string> {
    const fs = FsProvider.instance;
    const b64 = normalizeProfileData(profileData);
    const decoded = Buffer.from(b64, "base64");
    const destination = await getDownloadDestination();
    await fs.writeFile(destination, decoded);
    return destination;
}

/**
 * Downloads a mod profile to the local import cache and returns the path of the
 * created file.
 * @param profileCode - The profile code
 * @returns string The path to the created file
 */
async function downloadProfileCode(profileCode: string): Promise<string> {
    const response = await ProfileApiClient.getProfile(profileCode);
    return saveDownloadedProfile(response.data);
}

export const ProfileImportExport = {
    downloadProfileCode,
}
