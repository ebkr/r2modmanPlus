import Ajv from "ajv";
import addFormats from "ajv-formats";

import ecosystem from "../../assets/data/ecosystem.json";
import {ModloaderPackage, R2Modman, ThunderstoreEcosystem} from "../../assets/data/ecosystemTypes";
import jsonSchema from "../../assets/data/ecosystemJsonSchema.json";
import R2Error from "../errors/R2Error";
import {ref} from "@vue/reactivity";

// Re-export generated types/Enums to avoid having the whole codebase
// tightly coupled with the generated ecosystemTypes.
export {
    GameInstanceType,
    GameSelectionDisplayMode,
    Loader as PackageLoader,
    TrackingMethod,
    Platform,
} from "../../assets/data/ecosystemTypes";

export const EcosystemSupportedGames = ref<[string, R2Modman][]>([]);
export const EcosystemModloaderPackages = ref<ModloaderPackage[]>([]);

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
     * Get a list of [identifier, r2modman] entries i.e. games supported by the mod manager.
     */
    static get supportedGames() {
        const result: [string, R2Modman][] = []
        for (const [identifier, game] of Object.entries(this.ecosystem.games)) {
            if (game.r2modman == null) continue;
            for (const entry of game.r2modman) {
                result.push([identifier, entry]);
            }
        }
        return result;
    }

    static get modloaderPackages() {
        return this.ecosystem.modloaderPackages;
    }
}
