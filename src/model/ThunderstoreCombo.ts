import ThunderstoreMod from './ThunderstoreMod';
import R2Error from './errors/R2Error';
import ThunderstoreVersion from './ThunderstoreVersion';
import ManifestV2 from './ManifestV2';

export default class ThunderstoreCombo {

    private mod: ThunderstoreMod = new ThunderstoreMod();
    private version: ThunderstoreVersion = new ThunderstoreVersion();

    public static combine(mod: ThunderstoreMod, version: ThunderstoreVersion): ThunderstoreCombo {
        const combo = new ThunderstoreCombo();
        combo.mod = mod;
        combo.version = version;
        return combo;
    }

    public static fromProtocol(protocol: string, modList: ThunderstoreMod[]): ThunderstoreCombo | R2Error {
        // Strip out protocol information
        const reducedProtocol = protocol.replace(new RegExp("ror2mm://v1/install/([a-zA-Z0-9]+\.)?thunderstore\.io/"), '');
        const information = reducedProtocol.split('/');
        const packageName = `${information[0]}-${information[1]}`;
        const packageVersion = information[2];
        const foundMod = modList.find((mod: ThunderstoreMod) => mod.getFullName() === packageName);
        if (foundMod === undefined) {
            return new R2Error(
                'Mod does not exist',
                `Unable to resolve ${packageName} to a suitable Thunderstore mod`,
                'Relaunch the manager to update the mod list'
            );
        }
        const foundVersion = foundMod.getVersions().find((version: ThunderstoreVersion) => version.getVersionNumber().toString() === packageVersion);
        if (foundVersion === undefined) {
            return new R2Error(
                'Mod does not exist',
                `Unable to find version ${packageVersion} of mod ${packageName}`,
                'Relaunch the manager to update the mod list'
            );
        }
        return ThunderstoreCombo.combine(foundMod, foundVersion);
    }

    public getMod(): ThunderstoreMod {
        return this.mod;
    }

    public setMod(mod: ThunderstoreMod) {
        this.mod = mod;
    }

    public getVersion(): ThunderstoreVersion {
        return this.version;
    }

    public setVersion(version: ThunderstoreVersion) {
        this.version = version;
    }

    public isEqualTo(combo: ThunderstoreCombo): boolean {
        return combo.getMod().getFullName() === this.mod.getFullName()
            && combo.getVersion().getVersionNumber().isEqualTo(this.version.getVersionNumber());
    }

    public isEqualToManifestV2(manifest: ManifestV2): boolean {
        return manifest.getName() === this.mod.getFullName()
            && manifest.getVersionNumber().isEqualTo(this.version.getVersionNumber());
    }

    public split(): [ThunderstoreMod, ThunderstoreVersion] {
        return [this.mod, this.version];
    }
}
