import ZipExtrationError from 'src/model/errors/ZipExtractionError'
import FileWriteError from 'src/model/errors/FileWriteError';

import * as fs from 'fs-extra';
import * as unzipper from 'unzipper';
import * as path from 'path';

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
            }
        })
    }

    public static extractOnly(zip: string, outputFolder: string, callback: (success: boolean) => void): ZipExtrationError | null {
        try {
            fs.createReadStream(zip)
                .pipe(unzipper.Extract({ path: outputFolder })).promise().then(()=>{
                callback(true);
            }).catch(()=>{
                callback(false);
            });
        } catch(e) {
            const err: Error = e;
            return new ZipExtrationError(
                'Failed to extract zip file',
                err.message,
                null
            );
        }
        return null;
    }

}
