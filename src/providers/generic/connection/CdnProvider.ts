import R2Error from '../../../model/errors/R2Error';
import { getAxiosWithTimeouts } from '../../../utils/HttpUtils';
import { addOrReplaceSearchParams, replaceHost } from '../../../utils/UrlUtils';

const CDNS = [
    "gcdn.thunderstore.io",
    "hcdn-1.hcdn.thunderstore.io"
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
    private static preferredCdn = "";

    public static async checkCdnConnection() {
        const headers = {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
        };
        const params = {"disableCache": new Date().getTime()};
        let res;

        for await (const cdn of CDNS) {
            const url = `https://${cdn}/${TEST_FILE}`;

            try {
                res = await CdnProvider.axios.get(url, {headers, params});
            } catch (e) {
                continue;
            }

            if (res.status === 200) {
                CdnProvider.preferredCdn = cdn;
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
}
