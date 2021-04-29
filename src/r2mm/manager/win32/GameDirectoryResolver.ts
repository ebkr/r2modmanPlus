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
                const err = new Error();
                err.message = queryResult;
                throw err;
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
            const steamDir = await this.getSteamDirectory();
            if (steamDir instanceof R2Error) {
                return steamDir;
            }
            return await this.findSteamAppManifest(steamDir, game);
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
        console.log("Looking for libraryfolders.vdf in", steamapps);
        // Find all locations where games can be installed.
        try {
            const files = await fs.readdir(steamapps);
            for (const file of files) {
                if (file.toLowerCase() === 'libraryfolders.vdf') {
                    console.log("Located libraryfolders.vdf");
                    try {
                        const parsedVdf: any = vdf.parse((await fs.readFile(path.join(steamapps, file))).toString());
                        console.log("Parsed vdf");
                        for (const key in parsedVdf.LibraryFolders) {
                            if (!isNaN(Number(key))) {
                                console.log("Adding additional location:", parsedVdf.LibraryFolders[key])
                                locations.push(
                                    path.join(parsedVdf.LibraryFolders[key], 'steamapps')
                                );
                            }
                        }
                    } catch(e) {
                        console.log("Error locating/parsing vdf:", e);
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
            console.log("Error over libraryfolders.vdf", e);
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
        console.log("Exploring manifest locations");
        try {
            for (const location of locations) {
                (await fs.readdir(location))
                    .forEach((file: string) => {
                        if (file.toLowerCase() === `appmanifest_${game.activePlatform.storeIdentifier}.acf`) {
                            console.log("Found manifest:", location);
                            manifestLocation = location;
                        }
                    });
            }
        } catch(e) {
            console.log("Error locating manifests:", e);
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
            console.log("No matching appmanifest found");
            return new FileNotFoundError(
                `Unable to locate ${game.displayName} Installation Directory`,
                `Searched locations: ${locations}`,
                null
            )
        }
        // Game manifest found at ${manifestLocation}
        try {
            console.log("Manifest selected at:", manifestLocation);
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, `appmanifest_${game.activePlatform.storeIdentifier}.acf`))).toString();
            console.log("Read manifest file");
            const parsedVdf: any = vdf.parse(manifestVdf);
            console.log("Parsed vdf");
            const folderName = parsedVdf.AppState.installdir;
            console.log("Folder name:", folderName);
            const riskOfRain2Path = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(riskOfRain2Path)) {
                console.log("Found game directory:", riskOfRain2Path);
                return riskOfRain2Path;
            } else {
                console.log("Path not found:", riskOfRain2Path);
                return new FileNotFoundError(
                    `${game.displayName} does not exist in Steam\'s specified location`,
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            console.log("Final error:", e);
            const err: Error = e;
            return new R2Error(
                `An error occurred whilst locating the ${game.displayName} install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
