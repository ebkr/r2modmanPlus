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
        return this.performLink(riskOfRain2Directory, settings.linkedFiles);
    }

    private static performLink(installDirectory: string, previouslyLinkedFiles: string[]): string[] | R2Error {
        const newLinkedFiles: string[] = [];
        try {
            Logger.Log(LogSeverity.INFO, `Files to remove: \n-> ${previouslyLinkedFiles.join('\n-> ')}`);
            previouslyLinkedFiles.forEach((file: string) => {
                Logger.Log(LogSeverity.INFO, `Removing previously copied file: ${file}`);
                if (fs.existsSync(file)) {
                    fs.removeSync(file);
                }
            });
            try {
                const profileFiles = fs.readdirSync(Profile.getActiveProfile().getPathOfProfile());
                try {
                    profileFiles.forEach((file: string) => {
                        if (fs.lstatSync(path.join(Profile.getActiveProfile().getPathOfProfile(), file)).isFile()) {
                            if (file.toLowerCase() !== 'mods.yml') {
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
                        }
                    })
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        'Failed to install required files',
                        err.message,
                        'The game must not be running. You may need to run r2modman as an administrator.'
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

}
