import FileWriteError from '../../model/errors/FileWriteError';
import FsProvider from '../../providers/generic/file/FsProvider';
import * as path from 'path';
import R2Error from '../../model/errors/R2Error';
import FileUtils from '../../utils/FileUtils';
import ZipProvider from '../../providers/generic/zip/ZipProvider';

export default class ZipExtract {

    public static async extractAndDelete(zipFolder: string, filename: string, outputFolderName: string, callback: (success: boolean, error?: R2Error) => void): Promise<void> {
        const fs = FsProvider.instance;
        return await this.extractOnly(path.join(zipFolder, filename), path.join(zipFolder, outputFolderName), async (result, err?) => {
            if (result) {
                try {
                    await fs.unlink(path.join(zipFolder, filename));
                    callback(result);
                } catch (e) {
                    const err: Error = e as Error;
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
                    if (err !== undefined) {
                        if (err instanceof R2Error) {
                            callback(result, err);
                        } else {
                            throw err;
                        }
                    }
                } catch (e) {
                    callback(result, new FileWriteError(
                        'Failed to extract zip',
                        (e as Error).message,
                        'Try to re-download the mod. If the issue persists, ask for help in the Thunderstore modding discord.'
                    ));
                }
                // TODO: Is this needed?
                // finally {
                //     callback(result);
                // }
            }
        });
    }

    public static async extractOnly(zip: string, outputFolder: string, callback: (success: boolean, error?: Error) => void): Promise<void> {
        try {
            await ZipProvider.instance.extractAllTo(zip, outputFolder);
            callback(true);
        } catch (e) {
            console.log("extractOnly failed:", e);
            callback(false, new R2Error("Extraction failed", (e as Error).message, null));
        }
    }



}
