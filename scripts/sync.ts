import fs from "fs";

/**
 * This script synchronizes the in-repo ecosystem schema JSON to the latest
 * version.
 */

async function updateSchema() {
    console.log("Updating games.json...")
    const response = await fetch("https://thunderstore.io/api/experimental/schema/dev/latest/");
    if (response.status !== 200) {
        throw new Error(`Received non-200 status from schema API: ${response.status}`);
    }
    const data = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync("./src/assets/data/games.json", data);
    console.log("Done!");
}

updateSchema();
