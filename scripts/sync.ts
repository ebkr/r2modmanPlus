import fs from "fs";

import {FetchingJSONSchemaStore, InputData, JSONSchemaInput, quicktype} from "quicktype-core";

const ECOSYSTEM_DATA_URL = "https://thunderstore.io/api/experimental/schema/dev/latest/";
const ECOSYSTEM_JSON_SCHEMA_URL = "https://thunderstore.io/api/experimental/schema/ecosystem-json-schema/latest/";
const ECOSYSTEM_DATA_PATH = "./src/assets/data/ecosystem.json";
const ECOSYSTEM_JSON_SCHEMA_PATH = "./src/assets/data/ecosystemJsonSchema.json";
const ECOSYSTEM_DATA_TYPES_PATH = "./src/assets/data/ecosystemTypes.ts";

/**
 * This script synchronizes the in-repo ecosystem schema JSON to the latest
 * version and generates matching TypeScript types.
 */
async function updateSchema() {
    console.log("Updating ecosystem.json...");
    const response = await fetch(ECOSYSTEM_DATA_URL);
    if (response.status !== 200) {
        throw new Error(`Received non-200 status from schema API: ${response.status}`);
    }
    const data = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(ECOSYSTEM_DATA_PATH, data);

    console.log("Updating ecosystemJsonSchema.json...");
    const schemaResponse = await fetch(ECOSYSTEM_JSON_SCHEMA_URL);
    if (schemaResponse.status !== 200) {
        throw new Error(`Received non-200 status from schema API: ${schemaResponse.status}`);
    }
    const schema = Buffer.from(await schemaResponse.arrayBuffer());
    fs.writeFileSync(ECOSYSTEM_JSON_SCHEMA_PATH, schema);

    console.log("Updating ecosystemTypes.ts...");
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
    await schemaInput.addSource({name: "ThunderstoreEcosystem", schema: schema.toString()});
    const inputData = new InputData();
    inputData.addInput(schemaInput);
    const types = await quicktype({
        inputData,
        lang: "typescript",
        leadingComments: [{descriptionBlock: [
            "This file is automatically generated by the sync.ts script.",
            "Do not edit it manually.",
        ]}],
    });
    const finalTypes = enumKeysToUpperSnakeCase(types.lines.join("\n"));
    fs.writeFileSync(ECOSYSTEM_DATA_TYPES_PATH, finalTypes);
}

updateSchema();

function enumKeysToUpperSnakeCase(tsCode: string): string {
    const enumRegex = /export enum (\w+) \{([\s\S]*?)\}/g;
    const enumKeyValueRegex = /(\w+) = "(.*?)"/g;

    const enumKeyValueReplacer = (_: string, enumKey: string, enumValue: string) =>
        `${enumValue.replace(/-/g, "_").toUpperCase()} = "${enumValue}"`;

    return tsCode.replace(enumRegex, (_, enumName, enumBody) =>
        `export enum ${enumName} {${enumBody.replace(enumKeyValueRegex, enumKeyValueReplacer)}}`
    );
}
