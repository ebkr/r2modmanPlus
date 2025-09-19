import FileWriteError from '../../model/errors/FileWriteError';
import FsProvider from '../../providers/generic/file/FsProvider';
import R2Error from '../../model/errors/R2Error';
import FileUtils from '../../utils/FileUtils';
import ZipProvider from '../../providers/generic/zip/ZipProvider';
import path from '../../providers/node/path/path';

export default class ZipExtract {

    public static async extractAndDelete(zipFolder: string, filename: string, outputFolderName: string, callback: (success: boolean, error?: R2Error) => void): Promise<void> {
        const fs = FsProvider.instance;
        const source = path.join(zipFolder, filename);
        const destination = path.join(zipFolder, outputFolderName);

        try {
            await this.extractOnly(source, destination);
        } catch (originalError) {
            try {
                await FileUtils.emptyDirectory(destination);
                await fs.rmdir(destination);
                await fs.unlink(source);
            } catch (cleanupError) {
                // Cleanup might also fail e.g. for too long file paths on TSMM.
                // Show the original error instead of the one caused by the cleanup,
                // as the former is probably more informative for debugging.
            } finally {
                callback(false, FileWriteError.fromThrownValue(
                    originalError instanceof R2Error ? originalError.message : `${originalError}`,
                    `Failed to extract ${source}`,
                    'Try to re-download the mod. If the issue persists, ask for help in the Thunderstore modding discord.'
                ));
                return;
            }
        }

        try {
            await fs.unlink(source);
        } catch (e) {
            callback(false, FileWriteError.fromThrownValue(e, `Failed to delete ${source} after extraction`));
            return;
        }

        callback(true);
    }

    public static async extractOnly(zip: string, outputFolder: string): Promise<void> {
        try {
            await ZipProvider.instance.extractAllTo(zip, outputFolder);
        } catch (e) {
            console.log("extractOnly failed:", e);
            throw R2Error.fromThrownValue(e, `Extracting ${zip} failed`);
        }
    }
}
