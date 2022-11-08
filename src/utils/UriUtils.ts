export interface Ror2Uri {
    scheme: "ror2mm";
    version: string;
    action: string;
    parameters: string[];
}

/**
 * Custom URI scheme for deep linking into the mod manager.
 *
 * Format: ror2mm://<version>/<action>/[{parameters}/...]
 *
 * Examples:
 * ror2mm://v1/install/thunderstore.io/bbepis/BepInExPack/1.2.0/
 * ror2mm://v1/sync/server/0181ccb5-f160-23e7-bb54-cfdf6d3af56c/
 */
const ror2UriRe = new RegExp(/ror2mm:\/\/(\w+)\/(\w+)\/?(.*\/?)/);

export const URI_ACTION_INSTALL = "install";
export const URI_ACTION_SYNC = "sync";

const SUPPORTED: Record<string, string[]> = {
    "v1": [URI_ACTION_INSTALL, URI_ACTION_SYNC],
};


/**
 * Helper for parsing and validating custom scheme URIs.
 *
 * Deep linking to the mod manager is done via ror2mm:// scheme.
 */
export const parseCustomUri = (url: string): Ror2Uri|null => {
    const matches = url.match(ror2UriRe);

    if (!matches) {
        return null;
    }

    const [, version, action, parameters] = matches;

    if (!SUPPORTED[version]?.includes(action)) {
        return null;
    }

    return {
        scheme: "ror2mm",
        version,
        action,
        parameters: parameters.split("/").filter(Boolean)
    };
}
