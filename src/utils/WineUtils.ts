import Game from '../model/game/Game';
import R2Error from '../model/errors/R2Error';
import FsProvider from '../providers/generic/file/FsProvider';
import path from '../providers/node/path/path';
import GameDirectoryResolverProvider from '../providers/ror2/game/GameDirectoryResolverProvider';
import LinuxGameDirectoryResolver from '../r2mm/manager/linux/GameDirectoryResolver';

/**
 * Ensure the Proton/Wine prefix loads a proxy DLL (e.g. winhttp for BepInEx,
 * winmm for GDWeave) by adding a DllOverride to the prefix's user.reg. This is
 * what makes the mod loader start; without it the DLL copied into the game
 * directory is ignored by Windows/Proton.
 *
 * Extracted so both the launch flow and the "launch outside the manager" setup
 * can apply the same override.
 */
export async function ensureWineDllOverride(game: Game, proxyDll: string): Promise<void | R2Error> {
    const fs = FsProvider.instance;
    const compatDataDir = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).getCompatDataDirectory(game);
    if (compatDataDir instanceof R2Error) {
        return compatDataDir;
    }
    const userReg = path.join(compatDataDir, 'pfx', 'user.reg');
    const userRegData = (await fs.readFile(userReg)).toString();
    const ensuredUserRegData = regAddInSection(
        userRegData,
        "[Software\\\\Wine\\\\DllOverrides]",
        proxyDll,
        "native,builtin"
    );

    if (userRegData !== ensuredUserRegData) {
        await fs.copyFile(userReg, path.join(path.dirname(userReg), 'user.reg.bak'));
        await fs.writeFile(userReg, ensuredUserRegData);
    }
}

export function regAddInSection(reg: string, section: string, key: string, value: string): string {
    /*
        Example section
        [header]                // our section variable
        #time=...               // timestamp
        "key"="value"

        It's ended with two newlines (/n/n)
    */
    let split = reg.split("\n");

    let begin = 0;
    // Get section begin
    for (let index = 0; index < split.length; index++) {
        if (split[index]!.startsWith(section)) {
            begin = index + 2; // We need to skip the timestamp line
            break;
        }
    }

    // Get end
    let end = 0;
    for (let index = begin; index < split.length; index++) {
        if (split[index]!.length == 0) {
            end = index;
            break;
        }
    }

    // Check for key and fix it eventually, then return
    for (let index = begin; index < end; index++) {
        if (split[index]!.startsWith(`"${key}"`)) {
            split[index] = `"${key}"="${value}"`;
            return split.join("\n");
        }
    }

    // Append key and return
    split.splice(end, 0, `"${key}"="${value}"`);
    return split.join("\n");
}
