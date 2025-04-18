import R2Error from '../../../model/errors/R2Error';
import FileNotFoundError from '../../../model/errors/FileNotFoundError';
import VdfParseError from '../../../model/errors/Vdf/VdfParseError';

import * as vdf from '@node-steam/vdf';
import * as path from 'path';
import { homedir } from 'os';
import ManagerSettings from '../ManagerSettings';
import FsProvider from '../../../providers/generic/file/FsProvider';
import GameDirectoryResolverProvider from '../../../providers/ror2/game/GameDirectoryResolverProvider';
import Game from '../../../model/game/Game';
import GameManager from '../../../model/game/GameManager';
import { getPropertyFromPath } from '../../../utils/Common';
import DepotLoader from '../../../depots/loader/DepotLoader';

const FORCE_PROTON_FILENAME = ".forceproton";

export default class GameDirectoryResolverImpl extends GameDirectoryResolverProvider {

    public async getSteamDirectory(): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
        if (settings.getContext().global.steamDirectory != null) {
            return settings.getContext().global.steamDirectory!;
        }
        try {
            const dirs = [
                // Standard paths
                path.resolve(homedir(), '.local', 'share', 'Steam'),
                path.resolve(homedir(), '.steam', 'steam'),
                path.resolve(homedir(), '.steam', 'root'),
                path.resolve(homedir(), '.steam'),
                // Debian-specific paths
                path.resolve(homedir(), '.steam', 'debian-installation'),
                path.resolve(homedir(), '.steam', 'debian-installation', 'ubuntu12_32'),
                // Flatpak paths
                path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.local', 'share', 'Steam'),
                path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam', 'steam'),
                path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam', 'root'),
                path.resolve(homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam')
            ];
            for (let dir of dirs) {
                if (await FsProvider.instance.exists(dir) && (await FsProvider.instance.readdir(dir))
							.find(value => value.toLowerCase() === 'steam.sh') !== undefined)
                    return await FsProvider.instance.realpath(dir);
            }
            throw new Error('Steam is not installed');
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error(
                'Unable to resolve Steam install folder',
                err.message,
                'Try manually setting the Steam folder through the settings'
            )
        }
    }

    public async getDirectory(game: Game): Promise<R2Error | string> {
        const fs = FsProvider.instance;

        const settings = await ManagerSettings.getSingleton(game);
        if (settings.getContext().gameSpecific.gameDirectory != null) {
            return settings.getContext().gameSpecific.gameDirectory!;
        }
        try {
            const steamPath = await this.getSteamDirectory();
            if (steamPath instanceof R2Error)
                return steamPath;

            const manifestLocation = await this.findAppManifestLocation(steamPath, game);
            if (manifestLocation instanceof R2Error)
                return manifestLocation;

            const parsedVdf = await this.parseAppManifest(manifestLocation, game);
            const folderName = parsedVdf.AppState.installdir;
            const gamePath = path.join(manifestLocation, 'common', folderName);
            if (await fs.exists(gamePath)) {
                return gamePath;
            } else {
                return new FileNotFoundError(
                    `${game.displayName} does not exist in Steam\'s specified location`,
                    `Failed to find folder: ${gamePath}`,
                    null
                )
            }
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error(
                `Unable to resolve the ${game.displayName} install folder`,
                err.message,
                `Try manually locating the ${game.displayName} install folder through the settings`
            )
        }
    }

    private async _isProtonForced(game: Game) {
        const fs = FsProvider.instance;
        const gameDir = await this.getDirectory(game);
        if (gameDir instanceof R2Error)
            return false;
        return fs.exists(path.join(gameDir, FORCE_PROTON_FILENAME));
    }

    public async isProtonGame(game: Game) {
        try {
            if (await this._isProtonForced(game)) {
                console.log(`Proton was forced due to presence of ${FORCE_PROTON_FILENAME} file`);
                return true;
            }

            const steamPath = await this.getSteamDirectory();
            if (steamPath instanceof R2Error)
                return steamPath;

            const manifestLocation = await this.findAppManifestLocation(steamPath, game);
            if (manifestLocation instanceof R2Error)
                return manifestLocation;

            const appManifest = await this.parseAppManifest(manifestLocation, game);
            if (appManifest instanceof R2Error)
                return appManifest;

            const installedDepots = appManifest.AppState.InstalledDepots || {"0": {}};

            const depotKeys = Object.keys(installedDepots);
            let depotKey: string;
            if (depotKeys.length > 0) {
                depotKey = depotKeys[0];
            } else {
                depotKey = DepotLoader.DEPOT_DEFAULT_KEY;
            }


            try {
                const isProton = DepotLoader.isProtonRequiredForDepot(game, depotKey);
                console.log("Is proton game:", isProton);
                return isProton;
            } catch (e) {
                console.log(`Unable to resolve depot ${depotKey} for game ${game.displayName}. Defaulting to exe lookup. Caught error:`, e);
                const fs = FsProvider.instance;
                const gameDir = await this.getDirectory(game);
                if (gameDir instanceof R2Error)
                    return false;
                const dirContents = await fs.readdir(gameDir);
                // Assume running with proton if the game directory contains an executable.
                // If not found, we can relatively safely assume Linux.
                return dirContents.filter(value => value.toLowerCase().endsWith(".exe")).length > 0;
            }

        } catch (e) {
            const err: Error = e as Error;
            return new R2Error(
                `Unable to check if ${game.displayName} is a Proton game`,
                err.message,
                `If this happened, it is very likely that your game folder is not inside steamapps/common.`
            )
        }
    }

    public async getCompatDataDirectory(game: Game){
        const fs = FsProvider.instance;
        try {
            const steamPath = await this.getSteamDirectory();
            if (steamPath instanceof R2Error)
                return steamPath;

            const manifestLocation = await this.findAppManifestLocation(steamPath, game);
            if (manifestLocation instanceof R2Error)
                return manifestLocation;

            const compatDataPath = path.join(manifestLocation, 'compatdata', `${game.activePlatform.storeIdentifier}`);
            if (await fs.exists(compatDataPath)) {
                return compatDataPath;
            } else {
                return new FileNotFoundError(
                    `${game.displayName} compatibility data does not exist in Steam's specified location`,
                    `Failed to find folder: ${compatDataPath}`,
                    `If this happened, it is very likely that you did not start the game at least once. Please do it.`
                )
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error(
                `Unable to resolve the ${game.displayName} compatibility data folder`,
                err.message,
                `If this happened, it is very likely that you did not start the game at least once. Please do it.`
            )
        }
    }

    // TODO: Move this to Steam Utils when the multiple store refactor is made
    public async getLaunchArgs(game: Game): Promise<R2Error | string> {
        const steamDir = await this.getSteamDirectory();
        if (steamDir instanceof R2Error) return steamDir;

        let steamBaseDir;
        const probableSteamBaseDirs = [
            steamDir, // standard way
            path.join(steamDir, 'steam'), // ubuntu
            path.join(steamDir, 'root') // i am really mad at this
        ];

        for(const dir of probableSteamBaseDirs)
            if(
                await FsProvider.instance.exists(dir) &&
                (await FsProvider.instance.readdir(dir)).filter((x: string) => ['config', 'userdata'].includes(x)).length === 2
            ){
                steamBaseDir = await FsProvider.instance.realpath(dir);
                break;
            }

        if (typeof steamBaseDir === "undefined")
            return new R2Error(
                'An error occured whilst searching Steam user data locations',
                'Cannot define the steam config location',
                null
            );

        const loginUsers = vdf.parse((await FsProvider.instance.readFile(path.join(steamBaseDir, 'config', 'loginusers.vdf'))).toString());
        let userSteamID64 = '';
        for(let _id in loginUsers.users) {
            if(loginUsers.users[_id].MostRecent == 1) {
                userSteamID64 = _id;
                break;
            }
        }

        if(userSteamID64.length === 0) return new R2Error(
            'Unable to get the current Steam User ID',
            'Please try again',
            null
        );

        const userAccountID = (BigInt(userSteamID64) & BigInt(0xFFFFFFFF)).toString();

        const localConfig = vdf.parse((await FsProvider.instance.readFile(path.join(steamBaseDir, 'userdata', userAccountID, 'config', 'localconfig.vdf'))).toString());

        //find apps in one of possible locations.
        const apps = getPropertyFromPath(localConfig, [
            'UserLocalConfigStore.Software.Valve.Steam.Apps',
            'UserLocalConfigStore.Software.Valve.Steam.apps',
            'UserLocalConfigStore.Software.Valve.steam.apps'
        ]);
        if (!apps) {
            console.warn('Steam.Apps not found !');
        }

        return apps[game.activePlatform.storeIdentifier!].LaunchOptions || '';
    }

    private async findAppManifestLocation(steamPath: string, game: Game): Promise<R2Error | string> {
        // Check if we're at the end of the Steam path hierarchy
        const parentOfSteamPath = path.dirname(steamPath);
        const steamPathBaseName = path.basename(steamPath);
        
        // For special cases like debian-installation, we need to check if steamapps is in the parent directory
        let additionalPaths: string[] = [];
        if (steamPathBaseName === 'ubuntu12_32' && parentOfSteamPath.endsWith('debian-installation')) {
            additionalPaths.push(path.join(parentOfSteamPath, 'steamapps')); // Direct steamapps in debian-installation
        }
        
        const probableSteamAppsLocations = [
            // Standard locations
            path.join(steamPath, 'steamapps'), // every proper linux distro ever
            path.join(steamPath, 'steam', 'steamapps'), // Ubuntu LTS
            path.join(steamPath, 'root', 'steamapps'), // wtf? expect the unexpectable
            path.join(steamPath, 'debian-installation', 'steamapps'), // Debian installation
            // Additional special case locations
            ...additionalPaths
        ];

        let steamapps: string | undefined;
        for(const dir of probableSteamAppsLocations)
            if (await FsProvider.instance.exists(dir)){
                steamapps = await FsProvider.instance.realpath(dir);
                break;
            }

        if (steamapps === undefined) {
            return new R2Error(
                'An error occured whilst searching Steam library locations',
                'Cannot define the root steamapps location',
                null
            );
        }

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
        return manifestLocation;
    }

    private async parseAppManifest(manifestLocation: string, game: Game): Promise<any>{
        const fs = FsProvider.instance;
        try {
            const manifestVdf: string = (await fs.readFile(path.join(manifestLocation, `appmanifest_${game.activePlatform.storeIdentifier}.acf`))).toString();
            return vdf.parse(manifestVdf);
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error(
                `An error occured whilst locating the ${game.displayName} install folder from manifest in ${manifestLocation}`,
                err.message,
                null
            )
        }
    }

}
