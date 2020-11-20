import ZipExtractionError from '../../model/errors/ZipExtractionError';
import FileWriteError from '../../model/errors/FileWriteError';

import FsProvider from '../../providers/generic/file/FsProvider';
import * as path from 'path';
import AdmZip from 'adm-zip';
import R2Error from '../../model/errors/R2Error';
import FileUtils from '../../utils/FileUtils';

export default class ZipExtract {

    public static extractAndDelete(zipFolder: string, filename: string, outputFolderName: string, callback: (success: boolean, error?: R2Error) => void): ZipExtractionError | null {
        const fs = FsProvider.instance;
        return this.extractOnly(path.join(zipFolder, filename), path.join(zipFolder, outputFolderName), async result => {
            if (result) {
                try {
                    await fs.unlink(path.join(zipFolder, filename));
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
                    await FileUtils.emptyDirectory(path.join(zipFolder, outputFolderName));
                    await fs.rmdir(path.join(zipFolder, outputFolderName));
                    await fs.unlink(path.join(zipFolder, filename));
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



}
