import ProviderUtils from '../../generic/ProviderUtils';
import ThunderstoreCombo from '../../../model/ThunderstoreCombo';
import { DownloadStatusEnum } from '../../../model/enums/DownloadStatusEnum';
import R2Error from '../../../model/errors/R2Error';

export default abstract class ThunderstoreDownloaderProvider {

    private static provider: () => ThunderstoreDownloaderProvider;
    static provide(provided: () => ThunderstoreDownloaderProvider): void {
        this.provider = provided;
    }

    public static get instance(): ThunderstoreDownloaderProvider {
        if (ThunderstoreDownloaderProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("ThunderstoreDownloaderProvider");
        }
        return ThunderstoreDownloaderProvider.provider();
    }

    public abstract download(
        combos: ThunderstoreCombo[],
        ignoreCache: boolean,
        totalProgressCallback: (downloadedSize: number, modName: string, status: DownloadStatusEnum, err: R2Error | null) => void
    ): Promise<void>;

    /**
     * Save the download buffer to a zip file in the cache.
     *
     * @param response  The download buffer.
     * @param combo     The mod being downloaded.
     * @param callback  Callback on if saving and extracting has been performed correctly. An error is provided if success is false.
     */
    public abstract saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void): void;

}
