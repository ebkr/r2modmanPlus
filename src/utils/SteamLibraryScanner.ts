import * as vdf from '@node-steam/vdf';
import FsProvider from '../providers/generic/file/FsProvider';
import path from '../providers/node/path/path';
import os from '../providers/node/os/os';
import child from '../providers/node/child_process/child_process';
import appWindow from '../providers/node/app/app_window';

const STEAM_REGISTRY_QUERY = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"';

export async function getDefaultSteamPath(): Promise<string | null> {
    const platform = appWindow.getPlatform();
    const fs = FsProvider.instance;

    if (platform === 'win32') {
        try {
            const result = child.execSync(`powershell.exe "${STEAM_REGISTRY_QUERY}"`).toString().trim();
            for (const line of result.split('\n')) {
                if (line.trim().startsWith('InstallPath')) {
                    const value = line.substr('InstallPath'.length).trim().substr(1).trim();
                    if (value.length > 0) return value;
                }
            }
        } catch {
            // fall through
        }
        return null;
    }

    if (platform === 'darwin') {
        return path.resolve(os.homedir(), 'Library', 'Application Support', 'Steam');
    }

    // linux / fallback
    const candidates = [
        path.resolve(os.homedir(), '.local', 'share', 'Steam'),
        path.resolve(os.homedir(), '.steam', 'steam'),
        path.resolve(os.homedir(), '.steam', 'root'),
        path.resolve(os.homedir(), '.steam'),
        path.resolve(os.homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.local', 'share', 'Steam'),
        path.resolve(os.homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam', 'steam'),
        path.resolve(os.homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam', 'root'),
        path.resolve(os.homedir(), '.var', 'app', 'com.valvesoftware.Steam', '.steam'),
    ];
    for (const dir of candidates) {
        try {
            if (await fs.exists(dir)) {
                const entries = await fs.readdir(dir);
                if (entries.find((v: string) => v.toLowerCase() === 'steam.sh') !== undefined) {
                    return await fs.realpath(dir);
                }
            }
        } catch {
            // try next
        }
    }
    return null;
}

async function getSteamappsDir(steamPath: string): Promise<string | null> {
    const fs = FsProvider.instance;
    const candidates = [
        path.join(steamPath, 'steamapps'),
        path.join(steamPath, 'steam', 'steamapps'),
        path.join(steamPath, 'root', 'steamapps'),
    ];
    for (const dir of candidates) {
        try {
            if (await fs.exists(dir)) {
                return await fs.realpath(dir);
            }
        } catch {
            // try next
        }
    }
    return null;
}

async function getLibraryLocations(steamapps: string): Promise<string[]> {
    const fs = FsProvider.instance;
    const locations: string[] = [steamapps];
    try {
        const files = await fs.readdir(steamapps);
        for (const file of files) {
            if (file.toLowerCase() === 'libraryfolders.vdf') {
                try {
                    const raw = (await fs.readFile(path.join(steamapps, file))).toString();
                    const parsed: any = vdf.parse(raw);
                    if (parsed.libraryfolders !== undefined) {
                        for (const key of Object.keys(parsed.libraryfolders)) {
                            if (!isNaN(Number(key))) {
                                locations.push(path.join(parsed.libraryfolders[key].path, 'steamapps'));
                            }
                        }
                    } else if (parsed.LibraryFolders !== undefined) {
                        for (const key in parsed.LibraryFolders) {
                            if (!isNaN(Number(key))) {
                                locations.push(path.join(parsed.LibraryFolders[key], 'steamapps'));
                            }
                        }
                    }
                } catch {
                    // VDF parse failure — skip extra library folders
                }
                break;
            }
        }
    } catch {
        // Could not read steamapps dir — return just the root location
    }
    return locations;
}

const APP_MANIFEST_RE = /^appmanifest_(\d+)\.acf$/i;

async function collectAppIdsFromLocation(location: string): Promise<string[]> {
    const fs = FsProvider.instance;
    const ids: string[] = [];
    try {
        if (!(await fs.exists(location))) return ids;
        const files = await fs.readdir(location);
        for (const file of files) {
            const match = APP_MANIFEST_RE.exec(file);
            if (match) {
                ids.push(match[1]!);
            }
        }
    } catch {
        // Unreadable location — skip
    }
    return ids;
}

/**
 * Scans the Steam library and returns the set of installed Steam App IDs.
 *
 * @param customSteamPath  Optional path to a Steam installation to scan
 *                         instead of the auto-detected default.
 */
export async function getInstalledSteamAppIds(customSteamPath?: string): Promise<Set<string>> {
    const steamPath = customSteamPath ?? (await getDefaultSteamPath());
    if (!steamPath) return new Set();

    const steamapps = await getSteamappsDir(steamPath);
    if (!steamapps) return new Set();

    const locations = await getLibraryLocations(steamapps);

    const results = await Promise.all(locations.map(collectAppIdsFromLocation));
    return new Set(results.flat());
}
