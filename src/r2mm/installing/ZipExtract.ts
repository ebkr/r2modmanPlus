import ZipExtrationError from 'src/model/errors/ZipExtractionError'
import FileWriteError from 'src/model/errors/FileWriteError';

import * as fs from 'fs-extra';
import * as unzipper from 'unzipper';
import * as path from 'path';

export default class ZipExtract {

    public static extractAndDelete(zipFolder: string, filename: string, outputFolderName: string): ZipExtrationError | FileWriteError | null {
        try {
            fs.createReadStream(path.join(zipFolder, filename))
                .pipe(unzipper.Extract({ path: path.join(zipFolder, outputFolderName) }));
        } catch(e) {
            const err: Error = e;
            return new ZipExtrationError(
                'Failed to extract zip file',
                err.message
            );
        }
        
        try {
            fs.removeSync(path.join(zipFolder, filename));
        } catch(e) {
            const err: Error = e;
            return new FileWriteError(
                'Failed to delete file',
                err.message
            );
        }
        return null;
    }

}