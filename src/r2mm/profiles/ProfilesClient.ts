import Axios, { AxiosResponse } from 'axios';
import R2Error from '../../model/errors/R2Error';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import { transformPackageUrl } from '../../providers/cdn/PackageUrlTransformer';

const getProfileUrl = (profileImportCode: string): string => {
    return transformPackageUrl(`https://thunderstore.io/api/experimental/legacyprofile/get/${profileImportCode}/`);
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
        } else if (e.response.status === 404) {
            // Note that this error text is only applicable when importing, but it should be OK as creating a profile shouldn't respond with 404 anyway.
            return new R2Error(
                genericTitle,
                "404: Server responded with \"404: Not Found\".",
                "The profile import code entered might either be expired or contain typos."
            );
        } else {
            return new R2Error(
                genericTitle,
                `Failed with code: ${e.response.status}.\n${e.message}`,
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
        transformPackageUrl("https://thunderstore.io/api/experimental/legacyprofile/create/"),
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
