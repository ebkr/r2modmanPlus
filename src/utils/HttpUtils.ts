import axios from "axios";

import { DownloadProgressed } from "../providers/generic/connection/ConnectionProvider";

const newAbortSignal = (timeoutMs: number) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs);
    return abortController.signal;
};

/**
 * Return Axios instance with timeouts enabled.
 * @param responseTimeout Time (in ms) the server has to generate a
 *     response once a connection is established. Defaults to 5 seconds.
 * @param totalTimeout Time (in ms) the request has in total,
 *     including opening the connection and receiving the response.
 *     Defaults to 10 seconds.
 * @returns AxiosInstance
 */
export const getAxiosWithTimeouts = (responseTimeout = 5000, totalTimeout = 10000) => {
    const instance = axios.create({timeout: responseTimeout});

    // Use interceptors to have a fresh abort signal for each request,
    // so the instance can be shared by multiple requests.
    instance.interceptors.request.use((config) => {
        config.signal = newAbortSignal(totalTimeout);
        return config;
    });

    return instance;
};

interface LongRunningRequestOptions {
    /**
     * Custom function to be called when progress is made. Doesn't work
     * properly currently, since the progress percentage can't be
     * calculated because the total length of the content isn't known.
     */
    downloadProgressed?: DownloadProgressed;
    /**
     * Time (in ms) the request has to trigger the first download
     * progress event. This can be used to timeout early if a connection
     * can't be formed at all. Defaults to 30 seconds.
     */
    initialTimeout?: number;
    /**
     * Time (in ms) the request has in total to complete. This can be
     * used as a sanity check to prevent infinite requests. Defaults to
     * five minutes.
     */
    totalTimeout?: number;
    /**
     * Time (in ms) the request has to trigger subsequent download
     * progress events. This can be used to timeout the request if data
     * isn't transferred fast enough or at all. Defaults to one minute.
     */
    transmissionTimeout?: number;
}

/**
 * Make a GET request with extended timeouts.
 *
 * Since Axios's support lacks granularity, request timeouts are
 * controlled with AbortController and JavaScript timeouts instead.
 */
export const makeLongRunningGetRequest = async (
    url: string,
    options: Partial<LongRunningRequestOptions> = {}
) => {
    const {
        downloadProgressed = () => null,
        initialTimeout = 30 * 1000,
        totalTimeout = 5 * 60 * 1000,
        transmissionTimeout = 60 * 1000
    } = options;

    const abortController = new AbortController();
    const abort = () => abortController.abort();  // Set valid this.
    const sanityTimeout = setTimeout(abort, totalTimeout);
    let rollingTimeout = setTimeout(abort, initialTimeout);

    const onDownloadProgress = (progress: ProgressEvent) => {
        clearTimeout(rollingTimeout);
        rollingTimeout = setTimeout(abort, transmissionTimeout);

        if (typeof downloadProgressed === "function") {
            // TODO: Progress percentage can't be calculated since the
            // content length is unknown. Looks like this hasn't worked
            // in a while.
            downloadProgressed(0);
        }
    }

    const instance = axios.create({
        onDownloadProgress,
        signal: abortController.signal,
    });

    try {
        return await instance.get(url);
    } finally {
        clearTimeout(sanityTimeout);
        clearTimeout(rollingTimeout);
    }
}

export const isNetworkError = (responseOrError: unknown) =>
    responseOrError instanceof Error && responseOrError.message === "Network Error";

/**
 * Is the Error thrown by Axios request caused by a response timeout?
 */
export const isResponseTimeout = (error: unknown) =>
    error instanceof Error && /timeout of (\d+)ms exceeded/i.test(error.message);
