import { Depot, ProtonRequired } from 'src/depots/loader/Depot';
import R2Error from 'src/model/errors/R2Error';
import Game from 'src/model/game/Game';

export default class DepotLoader {

    public static DEPOT_DEFAULT_KEY = "default";

    private static LOADED_DEPOTS: Map<string, Depot[]> = new Map();

    private static load(): Map<string, Depot[]> {
        const master = require('../master.json');
        console.log("Master:", master);
        const depotMap = new Map<string, Depot[]>();
        for (let depotsKey in master.depots) {
            // @ts-ignore
            console.log("Depot key:", depotsKey);
            depotMap.set(depotsKey, require(`../${master.depots[depotsKey]}`).depots as Depot[]);
        }
        this.LOADED_DEPOTS = depotMap;
        return depotMap;
    }

    public static isProtonRequiredForDepot(game: Game, depotIdentifier: string): boolean {
        if (!this.LOADED_DEPOTS.has(game.internalFolderName)) {
            this.load();
        }
        const depots = this.LOADED_DEPOTS.get(game.internalFolderName);
        console.log("Depots:", depots);
        if (depots === undefined) {
            throw new R2Error(
                `Unable to load depot for ${game.internalFolderName}`,
                "This may be an issue with the manager. Report the issue in the appropriate discord server."
            );
        }
        const foundDepotKey = Object.keys(depots).find(value => value === depotIdentifier);
        let protonRequired: ProtonRequired;
        if (foundDepotKey === undefined) {
            console.log(`Unable to find depot [${depotIdentifier}] for ${game.internalFolderName}`);
            protonRequired = (depots as any)[this.DEPOT_DEFAULT_KEY];
        } else {
            protonRequired = (depots as any)[foundDepotKey];
        }
        return protonRequired.use_proton;
    }

}
