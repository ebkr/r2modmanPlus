import ThunderstoreMod from './ThunderstoreMod';
import R2Error from './errors/R2Error';
import ThunderstoreVersion from './ThunderstoreVersion';

export default class ThunderstoreCombo {

    private mod: ThunderstoreMod = new ThunderstoreMod();
    private version: ThunderstoreVersion = new ThunderstoreVersion();

    public static fromProtocol(protocol: string, modList: ThunderstoreMod[]): ThunderstoreCombo | R2Error {
        // Strip out protocol information
        const reducedProtocol = protocol.replace('ror2mm://v1/install/thunderstore.io/', '');
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
        const combo = new ThunderstoreCombo();
        combo.mod = foundMod;
        combo.version = foundVersion;
        return combo;
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

}
