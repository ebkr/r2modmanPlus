import R2Error from '../../../model/errors/R2Error';
import { getAxiosWithTimeouts } from '../../../utils/HttpUtils';
import { addOrReplaceSearchParams, replaceHost } from '../../../utils/UrlUtils';

/**
 * Assumptions about the data:
 * - There's exactly one CDN with type "main"
 * - There are 0..n CDNs with type of "main_alt" and "mirror", each
 * - Weights of "main" and "main_alt" CDNs must sum 1
 * - Weights of "mirror" CDNs are ignored
 */
interface Cdn {
    domain: string;
    type: "main" | "main_alt" | "mirror";
    weight: number;
}

const isCdnConfig = (obj: unknown): obj is Cdn[] => {
    if (!Array.isArray(obj)) {
        return false;
    }

    const cumulativeWeight = obj.reduce((acc, cdn) => {
        return cdn.type === "mirror" ? acc : acc + cdn.weight;
    }, 0);

    if (cumulativeWeight !== 1) {
        return false;
    }

    return obj.every((cdn) => {
        return typeof cdn === "object" &&
            cdn !== null &&
            typeof cdn.domain === "string" &&
            typeof cdn.type === "string" &&
            typeof cdn.weight === "number" &&
            (cdn.type === "main" || cdn.type === "main_alt" || cdn.type === "mirror") &&
            (cdn.weight >= 0 && cdn.weight <= 1);
    });
}

const CDN_CONFIG_URL = "https://thunderstore.io/api/experimental/cdn-config/prod/latest/";
const FALLBACK_CDNS: Cdn[] = [
    {domain: "gcdn.thunderstore.io", type: "main", weight: 1},
    {domain: "hcdn-1.hcdn.thunderstore.io", type: "mirror", weight: 0}
]
const TEST_FILE = "healthz";

const CONNECTION_ERROR = new R2Error(
    "Can't reach content delivery networks",
    `All Thunderstore CDNs seem to be currently unreachable from
     this computer. You can still use the mod manager, but
     downloading mods will not work.`,
    `Test another internet connection, if available. For example
     using a VPN or connecting to a mobile hotspot might solve the
     issue.`
);

export default class CdnProvider {
    private static axios = getAxiosWithTimeouts(5000, 5000);
    private static cdnConfig = FALLBACK_CDNS;
    private static preferredCdn = "";

    public static get mainCdn(): Cdn {
        return CdnProvider.cdnConfig.find((cdn) => cdn.type === "main")!;
    }

    // "main_alt" CDNs are used only for downloading packages
    // during the gradual rollout process and thus ignored here.
    public static get mainAndMirrors(): Cdn[] {
        return CdnProvider.cdnConfig.filter((cdn) => cdn.type !== "main_alt");
    }

    public static get current() {
        const i = CdnProvider.mainAndMirrors.findIndex((cdn) => cdn.domain === CdnProvider.preferredCdn);
        return {
            label: [-1, 0].includes(i) ? "Main CDN" : `Mirror #${i}`,
            url: CdnProvider.preferredCdn
        };
    }

    public static async fetchCdnDefinitions() {
        try {
            const response = await CdnProvider.axios.get(CDN_CONFIG_URL);

            if (!isCdnConfig(response.data)) {
                throw new Error("Invalid CDN configuration");
            }

            CdnProvider.cdnConfig = response.data;
        } catch (e) {
            CdnProvider.cdnConfig = FALLBACK_CDNS;
        }
    }

    public static async checkCdnConnection() {
        const headers = {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
        };
        const params = {"disableCache": new Date().getTime()};
        let res;

        for await (const cdn of CdnProvider.mainAndMirrors) {
            const url = `https://${cdn.domain}/${TEST_FILE}`;

            try {
                res = await CdnProvider.axios.get(url, {headers, params});
            } catch (e) {
                continue;
            }

            if (res.status === 200) {
                CdnProvider.preferredCdn = cdn.domain;
                return;
            }
        };

        throw CONNECTION_ERROR;
    }

    public static replaceCdnHost(url: string) {
        return CdnProvider.preferredCdn
            ? replaceHost(url, CdnProvider.preferredCdn)
            : url;
    }

    public static addCdnQueryParameter(url: string) {
        return CdnProvider.preferredCdn
            ? addOrReplaceSearchParams(url, `cdn=${CdnProvider.preferredCdn}`)
            : url;
    }

    // Direct proportion of package download requests from the main CDN
    // to the main_alt CDNs.
    public static addCdnQueryParameterForPackageDownload(url: string) {
        if (CdnProvider.preferredCdn === CdnProvider.mainCdn.domain) {
            const cdn = CdnProvider.selectWeightedCdn();
            return addOrReplaceSearchParams(url, `cdn=${cdn.domain}`);
        }

        return CdnProvider.addCdnQueryParameter(url);
    }

    public static togglePreferredCdn() {
        const domains = CdnProvider.mainAndMirrors.map((cdn) => cdn.domain);
        let currentIndex = domains.findIndex((d) => d === CdnProvider.preferredCdn);

        if (currentIndex === -1) {
            currentIndex = 0;
        }

        CdnProvider.preferredCdn = domains[currentIndex + 1] || domains[0];
    }

    private static selectWeightedCdn(): Cdn {
        const eligibleCdns = CdnProvider.cdnConfig.filter(cdn => cdn.type !== "mirror");
        const random = Math.random();
        let cumulativeWeight = 0;

        for (const cdn of eligibleCdns) {
            cumulativeWeight += cdn.weight;
            if (random <= cumulativeWeight) {
                return cdn;
            }
        }

        return CdnProvider.mainCdn;  // Shouldn't happen if weights sum to 1.
    }
}
