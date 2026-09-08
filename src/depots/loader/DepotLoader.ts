import { Depot } from '../../depots/loader/Depot';
import R2Error from '../../model/errors/R2Error';
import Game from '../../model/game/Game';
import master from '../master.json';

const DEPOT_FILES = import.meta.glob<{ depots: Depot }>('../*.depot.json', { eager: true, import: 'default' });

export default class DepotLoader {

    public static DEPOT_DEFAULT_KEY = "default";

    private static LOADED_DEPOTS: Map<string, Depot> = new Map();

    private static load(): Map<string, Depot> {
        const depotMap = new Map<string, Depot>();
        for (let depotsKey in master.depots) {
            const fileName = (master.depots as Record<string, string>)[depotsKey];
            const depotFile = DEPOT_FILES[`../${fileName}`];
            if (depotFile === undefined) {
                throw new R2Error(
                    `Unable to find depot file ${fileName} for ${depotsKey}`,
                    "This may be an issue with the manager. Report the issue in the appropriate discord server."
                );
            }
            depotMap.set(depotsKey, depotFile.depots);
        }
        this.LOADED_DEPOTS = depotMap;
        return depotMap;
    }

    public static isProtonRequiredForDepot(game: Game, depotIdentifier: string): boolean {
        if (!this.LOADED_DEPOTS.has(game.settingsIdentifier)) {
            this.load();
        }
        const depots = this.LOADED_DEPOTS.get(game.settingsIdentifier);
        if (depots === undefined) {
            throw new R2Error(
                `Unable to load depot for ${game.settingsIdentifier}`,
                "This may be an issue with the manager. Report the issue in the appropriate discord server."
            );
        }
        const protonRequired = depots[depotIdentifier] || depots[this.DEPOT_DEFAULT_KEY];
        return protonRequired!.use_proton;
    }

}
