import R2Error from '../../../model/errors/R2Error';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';

import child from 'child_process';
import * as vdf from '@node-steam/vdf';
import * as path from 'path';
import ManagerSettings from '../ManagerSettings';
import FsProvider from "../../../providers/generic/file/FsProvider";
import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';
import Game from '../../../model/game/Game';
import GameManager from '../../../model/game/GameManager';

const steamInstallDirectoryQuery = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"';

export default class GameDirectoryResolverImpl extends GameDirectoryResolverProvider {

    public async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        if (settings.getContext().global.steamDirectory != null) {
            return settings.getContext().global.steamDirectory!;
        }
        try {
            const queryResult: string = child.execSync(`powershell.exe "${steamInstallDirectoryQuery}"`).toString().trim();
            const installKeyValue = queryResult.split('\n');
            let installValue: string = '';
            installKeyValue.forEach((val: string) => {
                if (val.trim().startsWith('InstallPath')) {
                    installValue = val.substr(('InstallPath').length)
                        .trim()
                        // Remove colon
                        .substr(1)
                        .trim();
                }
            });
            if (installValue.trim().length === 0) {
                throw new Error(queryResult);
            }
            return installValue;
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve steam install directory',
                err.message,
                'Try manually setting the Steam directory through the settings'
            )
        }
    }

    public async getDirectory(game: Game): Promise<R2Error | string> {
        const settings = await ManagerSettings.getSingleton(game);
        if (settings.getContext().gameSpecific.gameDirectory != null) {
            return settings.getContext().gameSpecific.gameDirectory!;
        }
        try {
            const queryResult: string = (await child.exec(`powershell.exe "${steamInstallDirectoryQuery}"`)).toString().trim();
            const installKeyValue = queryResult.split('\n')[0].trim();
            // Remove key (InstallPath) from string
            const installValue = installKeyValue.substr(('InstallPath').length)
                .trim()
                // Remove colon
                .substr(1)
                .trim();
            const dir = await this.findSteamAppManifest(installValue, game);
            return dir;
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                `Unable to resolve the ${game.displayName} install directory`,
                err.message,
                `Try manually locating the ${game.displayName} install directory through the settings`
            )
        }
    }

    private async findSteamAppManifest(steamPath: string, game: Game): Promise<R2Error | string> {
        const steamapps = path.join(steamPath, 'steamapps');
        const locations: string[] = [steamapps];
        const fs = FsProvider.instance;
        // Find all locations where games can be installed.
        try {
            const files = await fs.readdir(steamapps);
            for (const file of files) {
                if (file.toLowerCase() === 'libraryfolders.vdf') {
                    try {
                        const parsedVdf: any = vdf.parse((await fs.readFile(path.join(steamapps, file))).toString());
                        for (const key in parsedVdf.LibraryFolders) {
                            if (!isNaN(Number(key))) {
                                locations.push(
                                    path.join(parsedVdf.LibraryFolders[key], 'steamapps')
                                );
                            }
                        }
                    } catch(e) {
                        const err: Error = e;
                        // Need to throw when inside forEach.
                        throw new VdfParseError(
                            'Unable to parse libraryfolders.vdf',
                            err.message,
                            null
                        )
                    }
                }
            }
        } catch(e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e;
            return new FileNotFoundError(
                'Unable to read directory',
                err.message,
                null
            )
        }
        // Look through given directories for ${appManifest}
        let manifestLocation: string | null = null;
        try {
            for (const location of locations) {
                (await fs.readdir(location))
                    .forEach((file: string) => {
                        if (file.toLowerCase() === `appmanifest_${game.activePlatform.storeIdentifier}.acf`) {
                            manifestLocation = location;
                        }
                    });
            }
        } catch(e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e;
            return new R2Error(
                'An error occured whilst searching Steam library locations',
                err.message,
                null
            )
        }
        if (manifestLocation === null) {
            return new FileNotFoundError(
                `Unable to locate ${game.displayName} Installation Directory`,
                `Searched locations: ${locations}`,
                null
            )
        }
        // Game manifest found at ${manifestLocation}
        try {
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, `appmanifest_${game.activePlatform.storeIdentifier}.acf`))).toString();
            const parsedVdf: any = vdf.parse(manifestVdf);
            const folderName = parsedVdf.AppState.installdir;
            const riskOfRain2Path = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(riskOfRain2Path)) {
                return riskOfRain2Path;
            } else {
                return new FileNotFoundError(
                    `${game.displayName} does not exist in Steam\'s specified location`,
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                `An error occurred whilst locating the ${game.displayName} install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
