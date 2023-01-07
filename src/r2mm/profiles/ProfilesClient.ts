import Axios, { AxiosResponse } from 'axios';
import R2Error from '../../model/errors/R2Error';

const getProfileUrl = (profileImportCode: string): string => {
    return `https://thunderstore.io/api/experimental/legacyprofile/get/${profileImportCode}/`;
}

async function createProfile(payload: string): Promise<AxiosResponse<{ key: string }>> {
    try {
        return await Axios.post(
            "https://thunderstore.io/api/experimental/legacyprofile/create/",
            payload,
            {
                headers: { 'Content-Type': 'application/octet-stream' }
            }
        );
    } catch (e: any) {
        if (Axios.isAxiosError(e) && e.response) {
            if (e.response.status == 429) {
                let message = e.message;
                try {
                    message = e.response.data.detail || e.message;
                } catch {
                }
                throw new R2Error(
                    "Too many exports in a short period of time",
                    message,
                    "Wait for a minute and try again"
                );
            } else {
                throw new R2Error(
                    "Failed to upload profile",
                    e.message,
                    `${e.response.status}`
                );
            }
        }
        throw e;
    }
}

async function getProfile(profileImportCode: string): Promise<AxiosResponse<string>> {
    return await Axios.get(getProfileUrl(profileImportCode));
}

export const ProfileApiClient = {
  createProfile,
  getProfile,
};
