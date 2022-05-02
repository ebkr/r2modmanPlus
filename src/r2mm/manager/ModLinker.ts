import R2Error from '../../model/errors/R2Error';
import Profile from '../../model/Profile';
import FileWriteError from '../../model/errors/FileWriteError';

import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import Game from '../../model/game/Game';
import LinuxGameDirectoryResolver from './linux/GameDirectoryResolver';
import FileTree from '../../model/file/FileTree';

export default class ModLinker {

    public static async link(profile: Profile, game: Game): Promise<string[] | R2Error> {
        if (process.platform === 'linux') {
            const isProton = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(game);
            if (!isProton) {
                // Game is native, BepInEx doesn't require moving. No linked files.
                return [];
            }
        } else if (process.platform === 'darwin') {
            // Linux games don't require moving BepInEx files.
            return [];
        }
        const gameDirectory: string | R2Error = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (gameDirectory instanceof R2Error) {
            return gameDirectory;
        }
        return this.performLink(profile, game, gameDirectory);
    }

    /**
     * Returns false if any of the following conditions are met:
     * - File doesn't exist in either from/to
     * - File size is different
     * - Date modified is different
     * @private
     */
    private static async isFileIdentical(fileToCheck: string, fileInOtherLocation: string): Promise<boolean> {
        const fs = FsProvider.instance;
        if ((await fs.exists(fileToCheck)) && (await fs.exists(fileInOtherLocation))) {
            const statFileToCheck = await fs.stat(fileToCheck);
            const statFileInOtherLocation = await fs.stat(fileInOtherLocation);
            return statFileToCheck.size === statFileInOtherLocation.size && statFileToCheck.mtime.getUTCMilliseconds() === statFileInOtherLocation.mtime.getUTCMilliseconds();
        }
        return false;
    }

    /* DEPRECATED */
    // Is this 100% needed?
    // Could move to a setting at a later date?
    // TBD: Only apply when starting vanilla?
    private static async cleanupLinkedFiles(profile: Profile, installDirectory: string, previouslyLinkedFiles: string[]) {
        const fs = FsProvider.instance;
        await LoggerProvider.instance.Log(LogSeverity.INFO, `Files to remove: \n-> ${previouslyLinkedFiles.join('\n-> ')}`);
        for (const file of previouslyLinkedFiles) {
            LoggerProvider.instance.Log(LogSeverity.INFO, `Removing previously copied file: ${file}`);
            if (await fs.exists(file)) {
                if ((await fs.lstat(file)).isDirectory()) {
                    // Kept for legacy directory wiping.
                    await FileUtils.emptyDirectory(file);
                    await fs.rmdir(file);
                } else {
                    const fileRelative = path.relative(installDirectory, file);
                    const fileInProfileDir = path.join(profile.getPathOfProfile(), fileRelative);
                    if (!(await this.isFileIdentical(fileInProfileDir, file)) && await fs.exists(file)) {
                        await fs.unlink(file);
                    }
                }
            }
        }
    }

    private static async performLink(profile: Profile, game: Game, installDirectory: string): Promise<string[] | R2Error> {
        const fs = FsProvider.instance;
        const newLinkedFiles: string[] = [];
        try {
            const profileFiles = await fs.readdir(profile.getPathOfProfile());
            try {
                for (const file of profileFiles) {
                    if ((await fs.lstat(path.join(profile.getPathOfProfile(), file))).isFile()) {
                        if (file.toLowerCase() !== 'mods.yml') {
                            try {
                                const gameDirFilePath = path.join(installDirectory, file);
                                const profileDirFilePath = path.join(profile.getPathOfProfile(), file);
                                if (!(await this.isFileIdentical(profileDirFilePath, gameDirFilePath))) {
                                    await fs.copyFile(profileDirFilePath, gameDirFilePath);
                                    const profileDirFileStat = await fs.stat(profileDirFilePath);
                                    await fs.setModifiedTime(gameDirFilePath, profileDirFileStat.mtime);
                                }
                                newLinkedFiles.push(gameDirFilePath);
                            } catch (e) {
                                const err: Error = e as Error;
                                throw new FileWriteError(
                                    `Couldn't copy file ${file} to ${game.displayName} directory`,
                                    err.message,
                                    `Try running ${ManagerInformation.APP_NAME} as an administrator`
                                )
                            }
                        }
                    } else {
                        if ((await fs.lstat(path.join(profile.getPathOfProfile(), file))).isDirectory()) {
                            if (!["bepinex", "mods", "melonloader", "plugins", "userdata", "_state", "userlibs", "qmods"].includes(file.toLowerCase())) {
                                const fileProfileFolderPath = path.join(profile.getPathOfProfile(), file);
                                const fileTree = await FileTree.buildFromLocation(fileProfileFolderPath);
                                if (fileTree instanceof R2Error) {
                                    return fileTree;
                                }
                                for (const recursiveFileInFolder of fileTree.getRecursiveFiles()) {
                                    const fileRelativeToProfileFolder = path.relative(profile.getPathOfProfile(), recursiveFileInFolder);
                                    const gameDirFile = path.join(installDirectory, fileRelativeToProfileFolder);
                                    if (!(await this.isFileIdentical(recursiveFileInFolder, gameDirFile))) {
                                        await FileUtils.ensureDirectory(path.join(installDirectory, path.dirname(fileRelativeToProfileFolder)));
                                        await fs.copyFile(recursiveFileInFolder, gameDirFile);
                                        const recursiveFileStat = await fs.stat(recursiveFileInFolder);
                                        await fs.setModifiedTime(gameDirFile, recursiveFileStat.mtime);
                                    }
                                    newLinkedFiles.push(gameDirFile);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                const err: Error = e as Error;
                return new FileWriteError(
                    'Failed to install required files',
                    err.message,
                    `The game must not be running. You may need to run ${ManagerInformation.APP_NAME} as an administrator.`
                );
            }
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error(
                `Unable to read directory for profile ${profile.getProfileName()}`,
                err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`
            )
        }
        return newLinkedFiles;
    }

}
