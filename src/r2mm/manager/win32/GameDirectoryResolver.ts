import R2Error from '../../../model/errors/R2Error';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';

import child from 'child_process';
import * as vdf from '@node-steam/vdf';
import * as path from 'path';
import ManagerSettings from '../ManagerSettings';
import FsProvider from "../../../providers/generic/file/FsProvider";
import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';

const installDirectoryQuery = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"';
const appManifest = 'appmanifest_1366540.acf';

export default class GameDirectoryResolverImpl extends GameDirectoryResolverProvider {

    public async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton();
        if (settings.steamDirectory != null) {
            return settings.steamDirectory;
        }
        try {
            const queryResult: string = child.execSync(`powershell.exe "${installDirectoryQuery}"`).toString().trim();
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

    public async getDirectory(): Promise<R2Error | string> {
        const settings = await ManagerSettings.getSingleton();
        if (settings.dysonSphereProgramDirectory != null) {
            return settings.dysonSphereProgramDirectory;
        }
        try {
            const queryResult: string = child.execSync(`powershell.exe "${installDirectoryQuery}"`).toString().trim();
            const installKeyValue = queryResult.split('\n')[0].trim();
            // Remove key (InstallPath) from string
            const installValue = installKeyValue.substr(('InstallPath').length)
                .trim()
                // Remove colon
                .substr(1)
                .trim();
            const dir = await this.findAppManifest(installValue);
            return dir;
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to resolve the Dyson Sphere Program install directory',
                err.message,
                'Try manually locating the Dyson Sphere Program install directory through the settings'
            )
        }
    }

    private async findAppManifest(steamPath: string): Promise<R2Error | string> {
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
                'Unable to locate Dyson Sphere Program Installation Directory',
                `Searched locations: ${locations}`,
                null
            )
        }
        // Game manifest found at ${manifestLocation}
        try {
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, appManifest))).toString();
            const parsedVdf: any = vdf.parse(manifestVdf);
            const folderName = parsedVdf.AppState.installdir;
            const riskOfRain2Path = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(riskOfRain2Path)) {
                return riskOfRain2Path;
            } else {
                return new FileNotFoundError(
                    'Dyson Sphere Program does not exist in Steam\'s specified location',
                    `Failed to find directory: ${riskOfRain2Path}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                `An error occured whilst locating the Dyson Sphere Program install directory from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
