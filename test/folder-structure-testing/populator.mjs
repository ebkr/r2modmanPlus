/**
 * Run manually via `node ./populator.mjs`
 * ---------------------------------------
 * Produces a package structure that allows testing different package formats in a sane way.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath  } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// I'm unsure why the test setup hasn't been automated but at least this makes
// it easier
const PATHS_EXPECTED_BY_TESTS = [
    path.join("BIE", "Plugins"),
    path.join("BIE", "Monomod"),
    path.join("BIE", "Patchers"),
    path.join("BIE", "Core"),
    path.join("BIE", "Config"),
    path.join("BIE", "GameSpecific", "GTFO", "GameData"),
    path.join("BIE", "GameSpecific", "GTFO", "Assets"),
    path.join("BIE", "GameSpecific", "NASB", "Voicepacks"),
    path.join("BIE", "GameSpecific", "NASB", "Skins"),
    path.join("BIE", "GameSpecific", "NASB", "CustomSongs"),
    path.join("BIE", "GameSpecific", "NASB", "Movesets"),
    path.join("BIE", "GameSpecific", "H3VR", "Sideloader"),
    path.join("BIE", "GameSpecific", "ThunderstoreDev", "NoFlatten", "Sub"),
    path.join("BIE", "GameSpecific", "ThunderstoreDev", "Also Sub"),
    path.join("BIE", "GameSpecific", "Timberborn", "Maps"),
    path.join("BIE", "GameSpecific", "Valheim", "SlimVML"),
    path.join("ML", "MelonLoader"),
    path.join("ML", "Managed"),
    path.join("ML", "Libs"),
    path.join("ML", "UserLibs"),
    path.join("ML", "Mods"),
    path.join("ML", "Plugins"),
    path.join("ML", "UserData"),
    path.join("ML", "GameSpecific", "BONEWORKS", "CustomItems"),
    path.join("ML", "GameSpecific", "BONEWORKS", "CustomMaps"),
    path.join("ML", "GameSpecific", "BONEWORKS", "PlayerModels"),
    path.join("ML", "GameSpecific", "BONEWORKS", "CustomLoadScreens"),
    path.join("ML", "GameSpecific", "BONEWORKS", "Music"),
    path.join("ML", "GameSpecific", "BONEWORKS", "Food"),
    path.join("ML", "GameSpecific", "BONEWORKS", "Scoreworks"),
    path.join("ML", "GameSpecific", "BONEWORKS", "CustomSkins"),
    path.join("ML", "GameSpecific", "BONEWORKS", "Grenades"),
];


for (const dirpath of PATHS_EXPECTED_BY_TESTS) {
    fs.mkdirSync(path.join(__dirname, "Package", dirpath),  { recursive: true });
}


function getDestinationDirs(basePath) {
    const destDirs = [];
    const items = fs.readdirSync(basePath);
    if (items.length === 0) {
        return [basePath];
    } else {
        items.forEach(item => {
            const newBasePath = path.join(basePath, item);
            if (fs.statSync(newBasePath).isDirectory()) {
                destDirs.push(...getDestinationDirs(newBasePath));
            }
        });
    }
    return destDirs;
}

const srcDest = path.join(__dirname, "Package");
const destDirs = getDestinationDirs(srcDest);

destDirs.forEach(dest => {
    const relativeTransformed = path.relative(srcDest, dest).replace(/[\/\\]/g, "_");
    const newDir = path.join(dest, `${relativeTransformed}_Files`);
    fs.mkdirSync(newDir);
    fs.writeFileSync(path.join(newDir, `${relativeTransformed}_file.txt`), "placeholder");
});
