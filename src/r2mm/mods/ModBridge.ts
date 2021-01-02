import ThunderstoreMod from '../../model/ThunderstoreMod';
import ThunderstoreVersion from '../../model/ThunderstoreVersion';
import ManifestV2 from '../../model/ManifestV2';
import ThunderstorePackages from '../data/ThunderstorePackages';

export default class ModBridge {

    public static getLatestVersion(mod: ManifestV2, modList: ThunderstoreMod[]): ThunderstoreVersion | void {
        const matchingMod: ThunderstoreMod | undefined = modList.find((tsMod: ThunderstoreMod) => tsMod.getFullName() === mod.getName());
        if (matchingMod === undefined) {
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

    public static isLatestVersion(vueMod: any): boolean {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const latestVersion: ThunderstoreVersion | void = ModBridge.getLatestVersion(mod, ThunderstorePackages.PACKAGES);
        if (latestVersion instanceof ThunderstoreVersion) {
            return mod.getVersionNumber()
                .isEqualTo(latestVersion.getVersionNumber()) || mod.getVersionNumber().isNewerThan(latestVersion.getVersionNumber());
        }
        return true;
    }

}
