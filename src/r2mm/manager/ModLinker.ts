import R2Error from 'src/model/errors/R2Error';
import Profile from 'src/model/Profile';
import FileWriteError from 'src/model/errors/FileWriteError';

import * as path from 'path';
import * as fs from 'fs-extra';
import ManagerSettings from './ManagerSettings';
import { Logger, LogSeverity } from '../logging/Logger';
import GameDirectoryResolver from './GameDirectoryResolver';

export default class ModLinker {

    public static link(): string[] | R2Error {
        const settings = ManagerSettings.getSingleton();
        const riskOfRain2Directory: string | R2Error = GameDirectoryResolver.getDirectory();
        if (riskOfRain2Directory instanceof R2Error) {
            return riskOfRain2Directory;
        }
        if (!settings.legacyInstallMode) {
            return this.performSymlink(riskOfRain2Directory, settings.linkedFiles);
        }
        return this.performLegacyInstall(riskOfRain2Directory, settings.linkedFiles);
    }

    private static performSymlink(installDirectory: string, previouslyLinkedFiles: string[]): string[] | R2Error {
        const newLinkedFiles: string[] = [];
        try {
            fs.emptyDirSync(path.join(installDirectory, 'r2modman'))
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Failed to ensure directory was created',
                err.message,
                'If r2modman was installed in the Risk of Rain 2 directory, please reinstall in a different location. \nIf not, try running the manager as an administrator.'
            )
        }
        try {
            Logger.Log(LogSeverity.INFO, `Files to remove: \n-> ${previouslyLinkedFiles.join('\n-> ')}`);
            previouslyLinkedFiles.forEach((file: string) => {
                Logger.Log(LogSeverity.INFO, `Removing previously copied file: ${file}`);
                fs.removeSync(file);
            });
            try {
                const profileFiles = fs.readdirSync(Profile.getActiveProfile().getPathOfProfile());
                try {
                    profileFiles.forEach((file: string) => {
                        if (fs.lstatSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file)).isFile()) {
                            if (file.toLowerCase() !== 'mods.yml') {
                                // Symlink Files in Install Root
                                try {
                                    fs.removeSync(path.join(installDirectory, file));
                                    // Existing -> Linked
                                    // Junction is used so users don't need Windows Developer Mode enabled.
                                    // https://stackoverflow.com/questions/57725093
                                    fs.copyFileSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file), path.join(installDirectory, file));
                                    newLinkedFiles.push(path.join(installDirectory, file));
                                } catch(e) {
                                    const err: Error = e;
                                    throw new FileWriteError(
                                        `Couldn't copy file ${file} to RoR2 directory`,
                                        err.message,
                                        'Try running r2modman as an administrator'
                                    )
                                }
                            }
                        } else {
                            // If directory, move to ${installDirectory}/r2modman/
                            // Directory should be empty from prior emptyDirSync
                            fs.symlinkSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file), path.join(installDirectory, 'r2modman', file), 'junction');
                            newLinkedFiles.push(path.join(installDirectory, 'r2modman', file));
                        }
                    })
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        'Failed to produce a symlink between profile and RoR2',
                        err.message,
                        'You may have to switch install mode in the settings'
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Unable to read directory for profile ${Profile.getActiveProfile().getProfileName()}`,
                    err.message,
                    'Try running r2modman as an administrator'
                )
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to delete file',
                err.message,
                'Try running r2modman as an administrator'
            )
        }
        return newLinkedFiles;
    }

    private static performLegacyInstall(installDirectory: string, previouslyLinkedFiles: string[]): string[] | R2Error {
        const newLinkedFiles: string[] = [];
        const dir: string = path.join(installDirectory, 'r2modman');
        try {
            fs.emptyDirSync(dir);
            previouslyLinkedFiles.forEach((file: string) => {
                fs.removeSync(file);
            });
            const profileFiles = fs.readdirSync(Profile.getActiveProfile().getPathOfProfile());
            profileFiles.forEach((file: string) => {
                if (fs.lstatSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file)).isFile()) {
                    if (file.toLowerCase() !== 'mods.yml') {
                        // Symlink Files in Install Root
                        try {
                            fs.removeSync(path.join(installDirectory, file));
                            fs.copyFileSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file), path.join(installDirectory, file));
                            newLinkedFiles.push(path.join(installDirectory, file));
                        } catch(e) {
                            const err: Error = e;
                            throw new FileWriteError(
                                `Couldn't copy file ${file} to RoR2 directory`,
                                err.message,
                                'Try running r2modman as an administrator'
                            )
                        }
                    }
                } else {
                    fs.copySync(path.join(Profile.getActiveProfile().getPathOfProfile(), file), path.join(dir, file));
                    newLinkedFiles.push(path.join(dir, file));
                }
            })
        } catch(e) {
            const err: Error = e;
            return new FileWriteError(
                'Failed to produce a symlink between profile and RoR2',
                err.message,
                'If r2modman was installed in the Risk of Rain 2 directory, please reinstall in a different location. \nIf not, try running the manager as an administrator.'
            );
        }
        return [];
    }

}
