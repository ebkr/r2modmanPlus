import Ajv from "ajv";
import addFormats from "ajv-formats";

import { ThunderstoreEcosystem }  from "../../assets/data/ecosystem.d";
import ecosystem from "../../assets/data/ecosystem.json";
import jsonSchema from "../../assets/data/ecosystemJsonSchema.json";
import R2Error from "../errors/R2Error";


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
     * Get a list of games which have valid r2mm entries.
     */
    static get supportedGames() {
        return Object.values(this.ecosystem.games).filter(
            (x): x is typeof x & {r2modman: NonNullable<typeof x["r2modman"]>} => x.r2modman != null
        );
    }

    static get modloaderPackages() {
        return this.ecosystem.modloaderPackages;
    }
}
