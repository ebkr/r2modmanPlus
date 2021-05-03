import ThunderstoreMod from '../../model/ThunderstoreMod';
import axios from 'axios';
import Game from '../../model/game/Game';
import ApiCacheUtils from '../../utils/ApiCacheUtils';
import ApiResponse from '../../model/api/ApiResponse';
import LoggerProvider, { LogSeverity } from 'src/providers/ror2/logging/LoggerProvider';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static EXCLUSIONS: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     * @return Empty promise
     */
    public static async update(game: Game): Promise<any> {
        try {
            await axios.get(game.exclusionsUrl, {
                timeout: 30000,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }).then(response => {
                const exclusionMap = new Map<string, boolean>();
                response.data.split('\n').forEach((exclude: string) => {
                    exclusionMap.set(exclude, true);
                });
                ThunderstorePackages.EXCLUSIONS = exclusionMap;
            })
        } catch (e) {
            LoggerProvider.instance.Log(LogSeverity.ACTION_STOPPED, `Failed to update exclusions: ${e.message}`);
        }
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
        response.data.forEach((mod: any) => {
            let tsMod = new ThunderstoreMod().parseFromThunderstoreData(mod);
            if (!ThunderstorePackages.EXCLUSIONS.has(tsMod.getFullName())) {
                tsMods.push(tsMod.parseFromThunderstoreData(mod));
            }
        });
        ThunderstorePackages.PACKAGES = tsMods;
    }

}
