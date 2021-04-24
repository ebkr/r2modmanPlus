import ThunderstoreMod from '../../model/ThunderstoreMod';
import axios, { AxiosResponse } from 'axios';
import Game from '../../model/game/Game';
import ApiCacheUtils from 'src/utils/ApiCacheUtils';
import ApiResponse from 'src/model/api/ApiResponse';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static EXCLUSIONS: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     * @return Empty promise
     */
    public static async update(game: Game): Promise<any> {
        return axios.get(game.thunderstoreUrl, {
            timeout: 10000
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
