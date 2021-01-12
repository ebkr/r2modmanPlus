import R2Error from '../../../model/errors/R2Error';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';

import * as vdf from '@node-steam/vdf';
import * as path from 'path';
import { homedir } from 'os';
import ManagerSettings from '../ManagerSettings';
import FsProvider from "../../../providers/generic/file/FsProvider";
import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';

const appManifest = 'appmanifest_632360.acf';

export default class GameDirectoryResolverImpl extends GameDirectoryResolverProvider {

    public async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton();
        if (settings.steamDirectory != null) {
            return settings.steamDirectory;
        }
        try {
            const dirs = [
                path.resolve(homedir(), '.local', 'share', 'Steam'),
                path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.local', 'share', 'Steam')
            ];
            for (let dir of dirs) {
                if (await FsProvider.instance.exists(dir))
                    return dir;
            }
            throw new Error('Steam is not installed');
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve Steam install directory',
                err.message,
                'Try manually setting the Steam directory through the settings'
            )
        }
    }

    public async getDirectory(): Promise<R2Error | string> {
        const fs = FsProvider.instance;

        const settings = await ManagerSettings.getSingleton();
        if (settings.riskOfRain2Directory != null) {
            return settings.riskOfRain2Directory;
        }
        try {
            const steamPath = await this.getSteamDirectory();
            if (steamPath instanceof R2Error)
                return steamPath;

            const manifestLocation = await this.findAppManifestLocation(steamPath);
            if (manifestLocation instanceof R2Error)
                return manifestLocation;
            
            const parsedVdf = await this.parseAppManifest(manifestLocation);
            const folderName = parsedVdf.AppState.installdir;
            const riskOfRain2Path = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(riskOfRain2Path)) {
                return riskOfRain2Path;
            } else {
                return new FileNotFoundError(
                    'Risk of Rain 2 does not exist in Steam\'s specified location',
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve the Risk of Rain 2 install directory',
                err.message,
                'Try manually locating the Risk of Rain 2 install directory through the settings'
            )
        }
    }

    public async getCompatDataDirectory(){
        const fs = FsProvider.instance;
        try {
            const steamPath = await this.getSteamDirectory();
            if (steamPath instanceof R2Error)
                return steamPath;

            const manifestLocation = await this.findAppManifestLocation(steamPath);
            if (manifestLocation instanceof R2Error)
                return manifestLocation;

            const compatDataPath = path.join(manifestLocation, 'compatdata', '632360');
            if (await fs.exists(compatDataPath)) {
                return compatDataPath;
            } else {
                return new FileNotFoundError(
                    'Risk of Rain 2 compatibility data do not exist in Steam\'s specified location',
                    `Failed to find directory: ${compatDataPath}`,
                    null
                )
            }
        } catch (e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve the Risk of Rain 2 compatibility data directory',
                err.message,
                'Try manually locating the Risk of Rain 2 compatibility data directory through the settings'
            )
        }
    }

    private async findAppManifestLocation(steamPath: string): Promise<R2Error | string> {
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
                        if (file.toLowerCase() === appManifest) {
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
                'Unable to locate Risk of Rain 2 Installation Directory',
                `Searched locations: ${locations}`,
                null
            )
        }
        // Game manifest found at ${manifestLocation}
        return manifestLocation;
    }

    private async parseAppManifest(manifestLocation: string): Promise<any>{
        const fs = FsProvider.instance;
        try {
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, appManifest))).toString();
            return vdf.parse(manifestVdf);
        } catch (e) {
            const err: Error = e;
            return new R2Error(
                `An error occured whilst locating the Risk Of Rain 2 install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
