import Ajv from "ajv";
import addFormats from "ajv-formats";

import ecosystem from "../../assets/data/ecosystem.json";
import { ThunderstoreEcosystem }  from "../../assets/data/ecosystemTypes";
import jsonSchema from "../../assets/data/ecosystemJsonSchema.json";
import R2Error from "../errors/R2Error";

// Re-export generated types/Enums to avoid having the whole codebase
// tightly coupled with the generated ecosystemTypes.
export {
    GameInstanceType,
    GameSelectionDisplayMode,
    TrackingMethod,
} from "../../assets/data/ecosystemTypes";

export class EcosystemSchema {
    private static _isValidated: boolean = false;

    /**
     * Get a validated instance of the ecosystem schema.
     */
    private static get ecosystem(): ThunderstoreEcosystem {
        if (this._isValidated) {
            return ecosystem as ThunderstoreEcosystem;
        }

        // Validate the schema via its schema schema.
        const ajv = new Ajv();
        addFormats(ajv);

        const validate = ajv.compile(jsonSchema);
        const isOk = validate(ecosystem);

        if (!isOk) {
            throw new R2Error("Schema validation error", ajv.errorsText(validate.errors));
        }

        this._isValidated = true;
        return ecosystem as ThunderstoreEcosystem;
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
