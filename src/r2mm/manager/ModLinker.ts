import R2Error from '../../model/errors/R2Error';
import Profile from '../../model/Profile';
import FileWriteError from '../../model/errors/FileWriteError';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import ManagerSettings from './ManagerSettings';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import Game from '../../model/game/Game';
import LinuxGameDirectoryResolver from 'src/r2mm/manager/linux/GameDirectoryResolver';

export default class ModLinker {

    public static async link(profile: Profile, game: Game): Promise<string[] | R2Error> {
        if (process.platform === 'linux') {
            const isProton = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(game);
            if (!isProton) {
                // Game is native, BepInEx doesn't require moving. No linked files.
                return [];
            }
        }
        const settings = await ManagerSettings.getSingleton(game);
        const gameDirectory: string | R2Error = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (gameDirectory instanceof R2Error) {
            return gameDirectory;
        }
        return this.performLink(profile, game, gameDirectory, settings.getContext().gameSpecific.linkedFiles);
    }

    private static async performLink(profile: Profile, game: Game, installDirectory: string, previouslyLinkedFiles: string[]): Promise<string[] | R2Error> {
        const fs = FsProvider.instance;
        const newLinkedFiles: string[] = [];
        try {
            LoggerProvider.instance.Log(LogSeverity.INFO, `Files to remove: \n-> ${previouslyLinkedFiles.join('\n-> ')}`);
            for (const file of previouslyLinkedFiles) {
                LoggerProvider.instance.Log(LogSeverity.INFO, `Removing previously copied file: ${file}`);
                if (await fs.exists(file)) {
                    if ((await fs.lstat(file)).isDirectory()) {
                        await FileUtils.emptyDirectory(file);
                        await fs.rmdir(file);
                    } else {
                        await fs.unlink(file);
                    }
                }
            }
            try {
                const profileFiles = await fs.readdir(profile.getPathOfProfile());
                try {
                    for (const file of profileFiles) {
                        if ((await fs.lstat(path.join(profile.getPathOfProfile(), file))).isFile()) {
                            if (file.toLowerCase() !== 'mods.yml') {
                                try {
                                    if (await fs.exists(path.join(installDirectory, file))) {
                                        await fs.unlink(path.join(installDirectory, file));
                                    }
                                    await fs.copyFile(path.join(profile.getPathOfProfile(), file), path.join(installDirectory, file));
                                    newLinkedFiles.push(path.join(installDirectory, file));
                                } catch(e) {
                                    const err: Error = e;
                                    throw new FileWriteError(
                                        `Couldn't copy file ${file} to ${game.displayName} directory`,
                                        err.message,
                                        `Try running ${ManagerInformation.APP_NAME} as an administrator`
                                    )
                                }
                            }
                        } else {
                            if ((await fs.lstat(path.join(profile.getPathOfProfile(), file))).isDirectory()) {
                                if (file.toLowerCase() != "bepinex") {
                                    if (await fs.exists(path.join(installDirectory, file))) {
                                        await FileUtils.emptyDirectory(path.join(installDirectory, file));
                                        await fs.rmdir(path.join(installDirectory, file));
                                    }
                                    await fs.copyFolder(path.join(profile.getPathOfProfile(), file), path.join(installDirectory, file));
                                    newLinkedFiles.push(path.join(installDirectory, file));
                                }
                            }
                        }
                    }
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        'Failed to install required files',
                        err.message,
                        `The game must not be running. You may need to run ${ManagerInformation.APP_NAME} as an administrator.`
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Unable to read directory for profile ${profile.getProfileName()}`,
                    err.message,
                    `Try running ${ManagerInformation.APP_NAME} as an administrator`
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to delete file',
                err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`
            )
        }
        return newLinkedFiles;
    }

}
