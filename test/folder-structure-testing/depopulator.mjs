/**
 * Run manually via `node ./populator.mjs`
 * ---------------------------------------
 * Produces a package structure that allows testing different package formats in a sane way.
 */

import * as fs from "fs";
import * as path from "path";

function getDestinationDirs(basePath) {
    const destDirs = [];
    const items = fs.readdirSync(basePath);
    const containsFiles = items.find(x => !fs.statSync(path.join(basePath, x)).isDirectory());
    const containsMetadataFiles = items.find(x => ["manifest.json", "readme.md", "icon.png"].includes(x.toLowerCase()));
    if (items.length === 0) {
        return [];
    } else if (containsFiles && !containsMetadataFiles) {
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

const srcDest = path.join(process.cwd(), "Package");
const destDirs = getDestinationDirs(srcDest);

destDirs.forEach(dest => {
    fs.readdirSync(dest).forEach(x => fs.unlinkSync(path.join(dest, x)));
    fs.rmdirSync(dest);
});
