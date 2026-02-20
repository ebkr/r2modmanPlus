import Ajv from "ajv";
import addFormats from "ajv-formats";

import { ThunderstoreEcosystem }  from "../../assets/data/ecosystemTypes";
import jsonSchema from "../../assets/data/ecosystemJsonSchema.json";
import R2Error from "../errors/R2Error";

// Re-export generated types/Enums to avoid having the whole codebase
// tightly coupled with the generated ecosystemTypes.
export {
    GameInstanceType,
    GameSelectionDisplayMode,
    Loader as PackageLoader,
    TrackingMethod,
    Platform,
} from "../../assets/data/ecosystemTypes";

export class EcosystemSchema {
    private static _ecosystem: ThunderstoreEcosystem | null = null;

    /**
     * Load ecosystem data.
     * Must be called before accessing any ecosystem data.
     */
    static async load(): Promise<void> {
        if (this._ecosystem) {
            return;
        }

        const response = await fetch('public://data/ecosystem.json');
        if (!response.ok) {
            throw new R2Error(
                "Failed to load ecosystem data",
                `HTTP ${response.status}: ${response.statusText}`
            );
        }

        const data = await response.json();

        // Validate the schema via its JSON schema.
        const ajv = new Ajv();
        addFormats(ajv);

        const validate = ajv.compile(jsonSchema);
        const isOk = validate(data);

        if (!isOk) {
            throw new R2Error("Schema validation error", ajv.errorsText(validate.errors));
        }

        this._ecosystem = data as ThunderstoreEcosystem;
    }

    private static get ecosystem(): ThunderstoreEcosystem {
        if (!this._ecosystem) {
            throw new R2Error(
                "Ecosystem not loaded",
                "Call EcosystemSchema.load() before accessing ecosystem data"
            );
        }
        return this._ecosystem;
    }

    /**
     * Get a list of r2modman entries i.e. games supported by the mod manager.
     */
    static get supportedGames() {
        return Object.values(this.ecosystem.games).flatMap(
            (game) => game.r2modman
        ).filter(
            (r2modman): r2modman is NonNullable<typeof r2modman> => r2modman != null
        );
    }

    static get modloaderPackages() {
        return this.ecosystem.modloaderPackages;
    }
}
