import R2Error from 'src/model/errors/R2Error';
import Profile from 'src/model/Profile';
import FileWriteError from 'src/model/errors/FileWriteError';

import * as fs from 'fs-extra';
import * as path from 'path';

export default class ModLinker {

    public static link(installDirectory: string, previouslyLinkedFiles: string[]): string[] | R2Error {
        const newLinkedFiles: string[] = [];
        try {
            fs.emptyDirSync(path.join(installDirectory, 'r2modman'))
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Failed to ensure directory was created',
                err.message
            ) 
        }
        try {
            previouslyLinkedFiles.forEach((file: string) => {
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
                                        err.message
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
                        err.message
                    );
                }
            } catch(e) {
                const err: Error = e;
                return new R2Error(
                    `Unable to read directory for profile ${Profile.getActiveProfile().getProfileName()}`,
                    err.message
                ) 
            }
        } catch(e) {
            const err: Error = e;
            return new R2Error(
                'Unable to delete file',
                err.message
            )
        }
        return newLinkedFiles;
    }
    
}