import ThunderstoreMod from '../../model/ThunderstoreMod';
import axios from 'axios';
import Game from '../../model/game/Game';
import ApiCacheUtils from '../../utils/ApiCacheUtils';
import ApiResponse from '../../model/api/ApiResponse';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static EXCLUSIONS: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     * @return Empty promise
     */
    public static async update(game: Game): Promise<any> {
        this.EXCLUSIONS = await ConnectionProvider.instance.getExclusions();
        return axios.get(game.thunderstoreUrl, {
            timeout: 30000
        })
            .then(value => {
                this.handlePackageApiResponse(value);
                return value;
            });
    }

    /**
     * Transform {response.data} to ThunderstoreMod list.
     * @param response api/v1/package data.
     */
    public static handlePackageApiResponse(response: ApiResponse) {
        ApiCacheUtils.storeLastRequest(response.data);
        let tsMods: ThunderstoreMod[] = [];
        if (response.data !== undefined) {
            response.data.forEach((mod: any) => {
                let tsMod = new ThunderstoreMod().parseFromThunderstoreData(mod);
                if (!ThunderstorePackages.EXCLUSIONS.has(tsMod.getFullName())) {
                    tsMods.push(tsMod.parseFromThunderstoreData(mod));
                }
            });
        } else {
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `Response data from API was undefined: ${JSON.stringify(response)}`);
        }
        ThunderstorePackages.PACKAGES = tsMods;
    }

}
