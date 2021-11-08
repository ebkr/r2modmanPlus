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

const srcDest = path.join(process.cwd(), "Package");
const destDirs = getDestinationDirs(srcDest);

destDirs.forEach(dest => {
    const relativeTransformed = path.relative(srcDest, dest).replace(/[\/\\]/g, "_");
    const newDir = path.join(dest, `${relativeTransformed}_Files`);
    fs.mkdirSync(newDir);
    fs.writeFileSync(path.join(newDir, `${relativeTransformed}_file.txt`), "placeholder");
});
