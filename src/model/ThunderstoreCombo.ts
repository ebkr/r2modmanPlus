import Game from './game/Game';
import ThunderstoreMod from './ThunderstoreMod';
import R2Error from './errors/R2Error';
import ThunderstoreVersion from './ThunderstoreVersion';
import * as PackageDb from '../r2mm/manager/PackageDexieStore';

export default class ThunderstoreCombo {

    private mod: ThunderstoreMod = new ThunderstoreMod();
    private version: ThunderstoreVersion = new ThunderstoreVersion();

    public static async fromProtocol(protocol: string, game: Game): Promise<ThunderstoreCombo | R2Error> {
        // Remove protocol information and trailing slash, leaving the package version information.
        const reducedProtocol = protocol
            .replace(new RegExp('ror2mm://v1/install/([a-zA-Z0-9]+\.)?thunderstore\.io/'), '')
            .replace(new RegExp('\/$'), '');
        const dependencyString = reducedProtocol.split('/').join('-');
        const foundMod = await PackageDb.getCombosByDependencyStrings(game, [dependencyString]);

        if (!foundMod.length) {
            return new R2Error(
                'Mod does not exist',
                `Unable to resolve ${dependencyString} to a suitable Thunderstore mod or version`,
                'Relaunch the manager to update the mod list. Ensure the correct game and profile is selected before opening the link.'
            );
        }

        return foundMod[0];
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
