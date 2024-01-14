import axios from "axios";

const newAbortSignal = (timeoutMs: number) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs);
    return abortController.signal;
};

/**
 * Return Axios instance with timeouts enabled.
 * @param responseTimeout Time (in ms) the server has to generate a
 *     response once a connection is established. Defaults to 5 seconds.
 * @param connectionTimeout Time (in ms) the request has in total,
 *     including opening the connection and receiving the response.
 *     Defaults to 10 seconds.
 * @returns AxiosInstance
 */
export const getAxiosWithTimeouts = (responseTimeout = 5000, connectionTimeout = 10000) => {
    const instance = axios.create({timeout: responseTimeout});

    // Use interceptors to have a fresh abort signal for each request,
    // so the instance can be shared by multiple requests.
    instance.interceptors.request.use((config) => {
        config.signal = newAbortSignal(connectionTimeout);
        return config;
    });

    return instance;
};

export const isNetworkError = (responseOrError: unknown) =>
    responseOrError instanceof Error && responseOrError.message === "Network Error";

/**
 * Is the Error thrown by Axios request caused by a response timeout?
 */
export const isResponseTimeout = (error: unknown) =>
    error instanceof Error && /timeout of (\d+)ms exceeded/i.test(error.message);
