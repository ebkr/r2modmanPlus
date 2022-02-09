import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';
import Game from '../../../model/game/Game';
import R2Error from '../../../model/errors/R2Error';
import path from 'path';
import { homedir } from 'os';
import FsProvider from '../../../providers/generic/file/FsProvider';
import ManagerSettings from '../../manager/ManagerSettings';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import * as vdf from '@node-steam/vdf';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';
import LoggerProvider, { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import GameManager from '../../../model/game/GameManager';

export default class DarwinGameDirectoryResolver extends GameDirectoryResolverProvider {

    async getDirectory(game: Game): Promise<string | R2Error> {
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
                `Unable to resolve the ${game.displayName} install directory`,
                err.message,
                `Try manually locating the ${game.displayName} install directory through the settings`
            )
        }
    }

    async getSteamDirectory(): Promise<string | R2Error> {
        const steamPath = path.resolve(homedir(), 'Library', 'Application Support', 'Steam');
        if (await FsProvider.instance.exists(steamPath)) {
            return steamPath;
        }
        return new R2Error("Steam is not installed", "No steam folder found for OSX in the default location", null);
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
            const err: Error = e as Error;
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
                if (riskOfRain2Path.endsWith(path.dirname(GameManager.activeGame.steamFolderName))) {
                    const dir = path.dirname(riskOfRain2Path);
                    return path.join(dir, GameManager.activeGame.steamFolderName);
                } else {
                    return riskOfRain2Path;
                }
            } else {
                return new FileNotFoundError(
                    `${game.displayName} does not exist in Steam\'s specified location`,
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error(
                `An error occurred whilst locating the ${game.displayName} install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
