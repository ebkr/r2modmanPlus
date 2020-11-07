import VersionNumber from "../../model/VersionNumber";

import * as yaml from 'yaml';
import * as path from 'path';
import Mod from '../../model/Mod';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileNotFoundError from '../../model/errors/FileNotFoundError';
import R2Error from '../../model/errors/R2Error';
import PathResolver from "../manager/PathResolver";
import FsProvider from '../../providers/generic/file/FsProvider';

const cacheDirectory: string = path.join(PathResolver.MOD_ROOT, 'cache');

export default class ModFromManifest {

    public static get(modName: string, versionNumber: VersionNumber): Mod | R2Error {
        const fs = FsProvider.instance;
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
