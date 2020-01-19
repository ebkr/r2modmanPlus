import ThunderstoreMod from './ThunderstoreMod';
import R2Error from './errors/R2Error';
import { isUndefined } from 'util';
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
        if (isUndefined(foundMod)) {
            return new R2Error(
                'Mod does not exist', 
                `Unable to resolve ${packageName} to a suitable Thunderstore mod`
            );
        }
        const foundVersion = foundMod?.getVersions().find((version: ThunderstoreVersion) => version.getVersionNumber().toString() === packageVersion);
        if (isUndefined(foundVersion)) {
            return new R2Error(
                'Mod does not exist', 
                `Unable to find version ${packageVersion} of mod ${packageName}`
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

    public getVersion(): ThunderstoreVersion {
        return this.version;
    }

}