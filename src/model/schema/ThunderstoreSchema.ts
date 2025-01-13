import Ajv from "ajv";
import addFormats from "ajv-formats";
import ecosystem from "../../../ecosystem.json";
import jsonSchema from "../../../ecosystemJsonSchema.json";
import R2Error from "../errors/R2Error";


export class EcosystemSchema {
    private static _isValidated: boolean = false;

    /**
     * Get a validated instance of the ecosystem schema.
     */
    static get get() {
        if (this._isValidated) {
            return ecosystem;
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
        return ecosystem;
    }

    /**
     * Get a list of games which have valid r2mm entries.
     */
    static get supportedGames() {
        return Object.values(this.get.games).filter((x) => x.r2modman != null);
    }

    static get modloaderPackages() {
        return this.get.modloader_packages;
    }
}
