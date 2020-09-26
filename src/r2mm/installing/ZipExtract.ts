import ZipExtractionError from '../../model/errors/ZipExtractionError';
import FileWriteError from '../../model/errors/FileWriteError';

import fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import R2Error from '../../model/errors/R2Error';

export default class ZipExtract {

    public static extractAndDelete(zipFolder: string, filename: string, outputFolderName: string, callback: (success: boolean, error?: R2Error) => void): ZipExtractionError | null {
        return this.extractOnly(path.join(zipFolder, filename), path.join(zipFolder, outputFolderName), result => {
            if (result) {
                try {
                    fs.unlinkSync(path.join(zipFolder, filename));
                    callback(result);
                } catch (e) {
                    const err: Error = e;
                    callback(result, new FileWriteError(
                        'Failed to delete file',
                        err.message,
                        null
                    ));
                }
            } else {
                try {
                    // Clear from cache as failed.
                    this.emptyDirectory(path.join(zipFolder, outputFolderName));
                    fs.rmdirSync(path.join(zipFolder, outputFolderName));
                    fs.unlinkSync(path.join(zipFolder, filename));
                } catch (e) {
                    callback(result, new FileWriteError(
                        'Failed to extract zip',
                        e.message,
                        'Try to re-download the mod. If the issue persists, ask for help in the Thunderstore modding discord.'
                    ));
                } finally {
                    callback(result);
                }
            }
        });
    }

    public static extractOnly(zip: string, outputFolder: string, callback: (success: boolean) => void): ZipExtractionError | null {
        try {
            const adm = new AdmZip(zip);
            adm.extractAllTo(outputFolder, true);
            callback(true);
        } catch (e) {
            callback(false);
        }
        return null;
    }

    static emptyDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (fs.lstatSync(file).isDirectory()) {
                this.emptyDirectory(file);
            } else {
                fs.unlinkSync(file);
            }
        })
    }



}
