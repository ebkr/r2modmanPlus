import R2Error from '../../model/errors/R2Error';
import { ImmutableProfile } from '../../model/Profile';
import FileWriteError from '../../model/errors/FileWriteError';
import FsProvider from '../../providers/generic/file/FsProvider';
import LoggerProvider, { LogSeverity } from '../../providers/ror2/logging/LoggerProvider';
import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import FileUtils from '../../utils/FileUtils';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import Game from '../../model/game/Game';
import LinuxGameDirectoryResolver from './linux/GameDirectoryResolver';
import FileTree from '../../model/file/FileTree';
import { PackageLoader } from "../../model/schema/ThunderstoreSchema";
import path from "../../providers/node/path/path";

export default class ModLinker {

    public static async link(profile: ImmutableProfile, game: Game): Promise<string[] | R2Error> {
        if (game.packageLoader == PackageLoader.BEPINEX) {
            if (window.app.getPlatform() === 'linux') {
                const isProton = await (GameDirectoryResolverProvider.instance as LinuxGameDirectoryResolver).isProtonGame(game);
                if (!isProton) {
                    // Game is native, BepInEx doesn't require moving. No linked files.
                    return [];
                }
            } else if (window.app.getPlatform() === 'darwin') {
                // Linux games don't require moving BepInEx files.
                return [];
            }
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
    private static async cleanupLinkedFiles(profile: ImmutableProfile, installDirectory: string, previouslyLinkedFiles: string[]) {
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
                    const fileInProfileDir = profile.joinToProfilePath(fileRelative);
                    if (!(await this.isFileIdentical(fileInProfileDir, file)) && await fs.exists(file)) {
                        await fs.unlink(file);
                    }
                }
            }
        }
    }

    private static getRootFilesDestination(game: Game, filename: string, installDirectory: string): string | null {
        const lowercased = filename.toLowerCase();
        if (lowercased == "mods.yml") {
            return null;
        }

        if (game.packageLoader == PackageLoader.SHIMLOADER) {
            if (["ue4ss.dll", "dwmapi.dll", "ue4ss-settings.ini"].indexOf(lowercased) > -1) {
                return path.join(installDirectory, game.dataFolderName, "Binaries", "Win64");
            }
            return null;
        } else {
            return installDirectory;
        }
    }

    private static async performLink(profile: ImmutableProfile, game: Game, installDirectory: string): Promise<string[] | R2Error> {
        const fs = FsProvider.instance;
        const newLinkedFiles: string[] = [];
        try {
            const profileFiles = await fs.readdir(profile.getProfilePath());
            try {
                for (const file of profileFiles) {
                    if ((await fs.lstat(profile.joinToProfilePath(file))).isFile()) {
                        try {
                            const targetDir = ModLinker.getRootFilesDestination(game, file, installDirectory);
                            if (targetDir === null) continue;

                            const gameDirFilePath = path.join(targetDir, file);
                            const profileDirFilePath = profile.joinToProfilePath(file);

                            if (!(await this.isFileIdentical(profileDirFilePath, gameDirFilePath))) {
                                await fs.copyFile(profileDirFilePath, gameDirFilePath);
                                const profileDirFileStat = await fs.stat(profileDirFilePath);
                                await fs.setModifiedTime(gameDirFilePath, profileDirFileStat.mtime);
                            }
                            newLinkedFiles.push(gameDirFilePath);
                        } catch (e) {
                            const err: Error = e as Error;
                            throw new FileWriteError(
                                `Couldn't copy file ${file} to ${game.displayName} folder`,
                                err.message,
                                `Try running ${ManagerInformation.APP_NAME} as an administrator`
                            )
                        }
                    } else {
                        if ((await fs.lstat(profile.joinToProfilePath(file))).isDirectory()) {
                            const exclusionsList = [
                                "bepinex", "bepinex_server", "mods",
                                "melonloader", "plugins", "userdata",
                                "_state", "userlibs", "qmods", "shimloader",
                                "returnofmodding", "gdweave"
                            ];

                            if (!exclusionsList.includes(file.toLowerCase())) {
                                const fileProfileFolderPath = profile.joinToProfilePath(file);
                                const fileTree = await FileTree.buildFromLocation(fileProfileFolderPath);
                                if (fileTree instanceof R2Error) {
                                    return fileTree;
                                }
                                for (const recursiveFileInFolder of fileTree.getRecursiveFiles()) {
                                    const fileRelativeToProfileFolder = path.relative(profile.getProfilePath(), recursiveFileInFolder);
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
                `Unable to read folder for profile ${profile.getProfileName()}`,
                err.message,
                `Try running ${ManagerInformation.APP_NAME} as an administrator`
            )
        }
        return newLinkedFiles;
    }

}
