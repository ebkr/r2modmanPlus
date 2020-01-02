import Mod from 'src/model/Mod';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import { isUndefined } from 'util';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';
import ManifestV2 from 'src/model/ManifestV2';

export default class ModBridge {

    public static getLatestVersion(mod: ManifestV2, modList: ThunderstoreMod[]): ThunderstoreVersion | void {
        const matchingMod: ThunderstoreMod | undefined = modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getName());
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

    public static getThunderstoreModFromMod(mod: ManifestV2, modList: ThunderstoreMod[]): ThunderstoreMod | undefined {
        return modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getName());
    }

}