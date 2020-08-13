import VersionNumber from "src/model/VersionNumber";

import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs-extra';
import Mod from 'src/model/Mod';
import YamlParseError from 'src/model/errors/Yaml/YamlParseError';
import FileNotFoundError from 'src/model/errors/FileNotFoundError';
import R2Error from 'src/model/errors/R2Error';
import PathResolver from "../manager/PathResolver";

const cacheDirectory: string = path.join(PathResolver.ROOT, 'games', 'Risk of Rain 2', 'cache');

export default class ModFromManifest {

    public static get(modName: string, versionNumber: VersionNumber): Mod | R2Error {
        try {
            const buf: Buffer = fs.readFileSync(
                path.join(cacheDirectory, modName, versionNumber.toString(), 'manifest.json')
            );
            try {
                const modManifest: any = yaml.parse(buf.toString());
                const mod: Mod = new Mod();
                mod.setName(modManifest.name);
                mod.setVersionNumber(new VersionNumber(modManifest.version_number));
                mod.setDescription(modManifest.description);
                mod.setDependencies(modManifest.dependencies);
                mod.setFullName(modName);
                try {
                    mod.setIcon(path.join(cacheDirectory, modName, versionNumber.toString(), 'icon.png'));
                } catch(e) {
                    const err: Error = e;
                    return new FileNotFoundError(
                        `Unable to locate icon.png for mod: ${modName}`,
                        err.message,
                        null
                    );
                }
                return mod;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    `Failed to parse manifest of mod: ${modName}`,
                    err.message,
                    null
                );
            }
        } catch(e) {
            const err: Error = e;
            return new FileNotFoundError(
                `Error reading manifest file of mod: ${modName}`,
                err.message,
                null
            );
        }
    }

}
