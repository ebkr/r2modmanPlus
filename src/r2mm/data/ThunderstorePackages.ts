import ThunderstoreMod from '../../model/ThunderstoreMod';
import axios from 'axios';
import Game from 'src/model/game/Game';

export default class ThunderstorePackages {

    public static PACKAGES: ThunderstoreMod[] = [];
    public static EXCLUSIONS: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Fetch latest V1 API data and apply to {PACKAGES}
     * @return Empty promise
     */
    public static async update(game: Game): Promise<any> {
        return axios.get(game.thunderstoreUrl)
            .then(value => ThunderstorePackages.handlePackageApiResponse(value))
            .catch((e_) => {
                // Do nothing, connection failed.
            });
    }

    /**
     * Transform {response.data} to ThunderstoreMod list.
     * @param response api/v1/package data.
     */
    public static handlePackageApiResponse(response: any) {
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
