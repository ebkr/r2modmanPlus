import ZipExtrationError from 'src/model/errors/ZipExtractionError'
import FileWriteError from 'src/model/errors/FileWriteError';

import * as fs from 'fs-extra';
import * as unzipper from 'unzipper';
import * as path from 'path';
import AdmZip from 'adm-zip';

export default class ZipExtract {

    public static extractAndDelete(zipFolder: string, filename: string, outputFolderName: string, callback: (success: boolean) => void): ZipExtrationError | null {
        return this.extractOnly(path.join(zipFolder, filename), path.join(zipFolder, outputFolderName), result => {
            if (result) {
                try {
                    fs.removeSync(path.join(zipFolder, filename));
                } catch(e) {
                    const err: Error = e;
                    return new FileWriteError(
                        'Failed to delete file',
                        err.message,
                        null
                    );
                } finally {
                    callback(result);
                }
            } else {
                try {
                    // Clear from cache as failed.
                    fs.rmdirSync(path.join(zipFolder, outputFolderName));
                    fs.rmdirSync(path.join(zipFolder, filename));
                } catch(e) {
                    // Ignore for now
                } finally {
                    callback(result);
                }
            }
        })
    }

    public static extractOnly(zip: string, outputFolder: string, callback: (success: boolean) => void): ZipExtrationError | null {
        const adm = new AdmZip(zip);
        adm.extractAllToAsync(outputFolder, true, (e) => {
            if (e) {
                callback(false);
                return new ZipExtrationError(
                    'Failed to extract zip file',
                    e.message,
                    null
                );
            } else {
                callback(true);
            }
        });
        return null;
    }

}
