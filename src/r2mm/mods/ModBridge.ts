import Mod from 'src/model/Mod';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import { isUndefined } from 'util';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';

export default class ModBridge {

    public static getLatestVersion(mod: Mod, modList: ThunderstoreMod[]): ThunderstoreVersion | void {
        const matchingMod: ThunderstoreMod | undefined = modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getFullName());
        if (isUndefined(matchingMod)) {
            return;
        }
        // Compare version numbers and reduce.
        return matchingMod.getVersions().reduce((v1: ThunderstoreVersion, v2: ThunderstoreVersion) => {
            if (v1.getVersionNumber().isNewerThan(v2.getVersionNumber())) {
                return v1;
            }
            return v2;
        });
    }

    public static getThunderstoreModFromMod(mod: Mod, modList: ThunderstoreMod[]): ThunderstoreMod | undefined {
        return modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getFullName());
    }

}