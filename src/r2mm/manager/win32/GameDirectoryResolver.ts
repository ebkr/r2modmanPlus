import R2Error from '../../../model/errors/R2Error';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';
import child from '../../../providers/node/child_process/child_process';
import * as vdf from '@node-steam/vdf';
import ManagerSettings from '../ManagerSettings';
import FsProvider from '../../../providers/generic/file/FsProvider';
import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';
import Game from '../../../model/game/Game';
import GameManager from '../../../model/game/GameManager';
import LoggerProvider, { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import path from '../../../providers/node/path/path';

const steamInstallDirectoryQuery = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"';

export default class GameDirectoryResolverImpl extends GameDirectoryResolverProvider {

    public async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        if (settings.getContext().global.steamDirectory != null && settings.getContext().global.steamDirectory!.length > 0) {
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
            const err: Error = e as Error;
            return new R2Error(
                'Unable to resolve steam install folder',
                err.message,
                'Try manually setting the Steam folder through the settings'
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
            const err: Error = e as Error;
            return new R2Error(
                `Unable to resolve the ${game.displayName} install folder`,
                err.message,
                `Try manually locating the ${game.displayName} install folder through the settings`
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
                        if (parsedVdf.libraryfolders !== undefined) {
                            for (const key of Object.keys(parsedVdf.libraryfolders)) {
                                if (!isNaN(Number(key))) {
                                    locations.push(
                                        path.join(parsedVdf.libraryfolders[key].path, 'steamapps')
                                    );
                                }
                            }
                        } else {
                            for (const key in parsedVdf.LibraryFolders) {
                                if (!isNaN(Number(key))) {
                                    locations.push(
                                        path.join(parsedVdf.LibraryFolders[key], 'steamapps')
                                    );
                                }
                            }
                        }
                    } catch(e) {
                        const err: Error = e as Error;
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
            LoggerProvider.instance.Log(LogSeverity.ERROR, (e as Error).message);
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e as Error;
            return new FileNotFoundError(
                'Unable to read folder',
                err.message,
                null
            )
        }

        // Look through given directories for ${appManifest}
        let manifestLocation: string | null = null;
        try {
            for (const location of locations) {
                if (await fs.exists(location)) {
                    (await fs.readdir(location))
                        .forEach((file: string) => {
                            if (file.toLowerCase() === `appmanifest_${game.activePlatform.storeIdentifier}.acf`) {
                                manifestLocation = location;
                            }
                        });
                    }
                }
        } catch(e) {
            if (e instanceof R2Error) {
                return e;
            }
            const err: Error = e as Error;
            return new R2Error(
                'An error occured whilst searching Steam library locations',
                err.message,
                null
            )
        }
        if (manifestLocation === null) {
            return new FileNotFoundError(
                `Unable to locate ${game.displayName} Installation Folder`,
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
                if (riskOfRain2Path.endsWith(path.dirname(GameManager.activeGame.steamFolderName))) {
                    const dir = path.dirname(riskOfRain2Path);
                    return path.join(dir, GameManager.activeGame.steamFolderName);
                } else {
                    return riskOfRain2Path;
                }
            } else {
                return new FileNotFoundError(
                    `${game.displayName} does not exist in Steam\'s specified location`,
                    `Failed to find folder: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error(
                `An error occurred whilst locating the ${game.displayName} install folder from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
