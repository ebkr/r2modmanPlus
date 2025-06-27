import { retry } from "../../utils/Common";
import FileUtils from '../../utils/FileUtils';
import path from 'path';
import R2Error from "../../model/errors/R2Error";
import PathResolver from '../../r2mm/manager/PathResolver';
import FsProvider from '../../providers/generic/file/FsProvider';
import { ProfileApiClient } from '../../r2mm/profiles/ProfilesClient';
import {AxiosResponse} from "axios";

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

const isProfileDataValid = (profileData: string): boolean => {
    return profileData.startsWith(PROFILE_DATA_PREFIX)
}

async function saveDownloadedProfile(profileData: string): Promise<string> {
    if (!isProfileDataValid(profileData)) {
        throw new Error("Invalid profile data");
    }

    const fs = FsProvider.instance;
    const b64 = profileData.substring(PROFILE_DATA_PREFIX.length).trim();
    const decoded = window.node.buffer.from(b64, "base64");
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
    try {
        let is404: boolean = false;
        const response: AxiosResponse<string> = await retry(
            () => ProfileApiClient.getProfile(profileCode),
            {
                attempts: 5,
                interval: 1000,
                canRetry: () => { return !is404 },
                onError: (e: unknown) => {
                    console.error(e);
                    if (R2Error.fromThrownValue(e).message.startsWith("404")) {
                        is404 = true;
                    }
                },
                throwLastErrorAsIs: true
            }
        );
        return saveDownloadedProfile(response.data);
    } catch (e: unknown) {
        if (e instanceof Error && e.message === "Network Error") {
            throw new R2Error(
                "Failed to download the profile",
                "\"Network Error\" encountered when trying to download the profile from the server.",
                "Check your network connection or try toggling the preferred Thunderstore CDN in the settings."
            );
        } else {
            throw e;
        }
    }
}

export const ProfileImportExport = {
    downloadProfileCode,
}
