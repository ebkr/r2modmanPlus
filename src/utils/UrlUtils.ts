/**
 * Append given search parameters to an URL which may or may not already
 * have search parameters.
 *
 * Existing search parameters with a key present in the new parameters
 * will be overwritten.
 */
export const addOrReplaceSearchParams = (url: string, paramString: string) => {
    const newUrl = new URL(url);
    newUrl.search = new URLSearchParams(
        Object.assign(
            {},
            Object.fromEntries(newUrl.searchParams),
            Object.fromEntries(new URLSearchParams(paramString))
        )
    ).toString();
    return newUrl.href;
}

/**
 * Replace URL host, i.e. the domain and the port number.
 *
 * @param url e.g. "https://thunderstore.io/foo"
 * @param domainAndPort e.g. "thunderstore.dev" or "thunderstore.dev:8080"
 * @returns e.g. "https://thunderstore.dev:8080/foo"
 */
export const replaceHost = (url: string, domainAndPort: string) => {
    const newValues = domainAndPort.split(":");
    const newUrl = new URL(url);
    newUrl.hostname = newValues[0];
    newUrl.port = newValues[1] || "";
    return newUrl.href;
};
