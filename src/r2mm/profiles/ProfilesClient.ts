import Axios, { AxiosResponse } from 'axios';
import R2Error from '../../model/errors/R2Error';
import CdnProvider from '../../providers/generic/connection/CdnProvider';

const getProfileUrl = (profileImportCode: string): string => {
    return `https://thunderstore.io/api/experimental/legacyprofile/get/${profileImportCode}/`;
}

function formatApiError<T>(e: T, genericTitle: string): R2Error | T {
    if (Axios.isAxiosError(e) && e.response) {
        if (e.response.status == 429) {
            let message = e.message;
            try {
                message = e.response.data.detail || e.message;
            } catch {
            }
            return new R2Error(
                "Too many attempts in a short period of time",
                message,
                "You were rate limited by the server, wait for a while and try again."
            );
        } else {
            return new R2Error(
                genericTitle,
                e.message,
                `${e.response.status}`
            );
        }
    }
    return e;
}

async function handleApiErrors<I, J>(
    apiCall: Promise<AxiosResponse<I, J>>,
    errorTitle: string,
): Promise<AxiosResponse<I, J>> {
    try {
        const response = await apiCall;
        if (Axios.isAxiosError(response)) {
            throw response;
        }
        return response;
    } catch (e: any) {
        throw formatApiError(e, errorTitle);
    }
}

function createProfile(payload: string): Promise<AxiosResponse<{ key: string }>> {
    return handleApiErrors(Axios.post(
        "https://thunderstore.io/api/experimental/legacyprofile/create/",
        payload,
        {
            headers: { 'Content-Type': 'application/octet-stream' }
        }
    ), "Failed to upload profile");
}

function getProfile(profileImportCode: string): Promise<AxiosResponse<string>> {
    const url = CdnProvider.addCdnQueryParameter(
        getProfileUrl(profileImportCode)
    );
    return handleApiErrors(Axios.get(url), "Failed to download profile");
}

export const ProfileApiClient = {
  createProfile,
  getProfile,
};
