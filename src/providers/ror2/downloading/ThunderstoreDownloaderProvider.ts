import ProviderUtils from '../ProviderUtils';
import ThunderstoreVersion from '../../../model/ThunderstoreVersion';
import ThunderstoreMod from '../../../model/ThunderstoreMod';
import ThunderstoreCombo from '../../../model/ThunderstoreCombo';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import ExportMod from '../../../model/exports/ExportMod';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';

export default abstract class ThunderstoreDownloaderProvider {

    private static provider: () => ThunderstoreDownloaderProvider;
    static provide(provided: () => ThunderstoreDownloaderProvider): void {
        this.provider = provided;
    }

    public static get instance(): ThunderstoreDownloaderProvider {
        if (ThunderstoreDownloaderProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ThunderstoreDownloaderProvider");
        }
        return ThunderstoreDownloaderProvider.provider();
    }

    /**
     * Resolve all downloadable dependencies of a ThunderstoreVersion matching their exact version numbers.
     * This method is recursive to allow dependency building from nested dependencies.
     *
     * @param mod       The current mod to download.
     * @param allMods   An array of all mods available from the Thunderstore API.
     * @param builder   An array of resolved dependencies.
     * @return          ThunderstoreCombo array of the final result of the builder.
     */
    public abstract buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[];

    /**
     * Resolve all downloadable dependencies of a ThunderstoreVersion fetching the latest version of the dependency.
     * This method is recursive to allow dependency building from nested dependencies.
     *
     * @param mod       The current mod to download.
     * @param allMods   An array of all mods available from the Thunderstore API.
     * @param builder   An array of resolved dependencies.
     * @return          ThunderstoreCombo array of the final result of the builder.
     */
    public abstract buildDependencySetUsingLatest(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[];

    /**
     * Allows a list of mods passed in to be converted to the latest version of their equivalent upload.
     *
     * @param mods
     * @param allMods
     */
    public abstract getLatestOfAllToUpdate(mods: ManifestV2[], allMods: ThunderstoreMod[]): ThunderstoreCombo[];

    /**
     * A top-level method to download the latest version of all mods passed in, including their dependencies.
     *
     * @param mods              An array of ManifestV2 objects to be updated.
     * @param allMods           An array of all mods available from the Thunderstore API.
     * @param callback          Callback to show the current state of the downloads.
     * @param completedCallback Callback to perform final actions against. Only called if {@param callback} has not returned a failed status.
     */
    public abstract downloadLatestOfAll(mods: ManifestV2[], allMods: ThunderstoreMod[],
                               callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                               completedCallback: (modList: ThunderstoreCombo[]) => void): void;

    /**
     * A top-level method to download the latest version of a mod including its dependencies.
     *
     * @param mod               The mod to be downloaded.
     * @param modVersion        The version of the mod to download.
     * @param allMods           An array of all mods available from the Thunderstore API.
     * @param callback          Callback to show the current state of the downloads.
     * @param completedCallback Callback to perform final actions against. Only called if {@param callback} has not returned a failed status.
     */
    public abstract download(mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[],
                    callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                    completedCallback: (modList: ThunderstoreCombo[]) => void): void;

    /**
     * A top-level method to download exact versions of exported mods.
     *
     * @param modList           An array of {@class ExportMod} mods to download.
     * @param callback          See {@method download}.
     * @param completedCallback See {@method download}
     */
    public abstract downloadImportedMods(modList: ExportMod[],
                                callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                completedCallback: (mods: ThunderstoreCombo[]) => void): void;

    /**
     * Generate the current progress across all downloads.
     *
     * @param progress      The current download's progress.
     * @param currentIndex  The number of mods currently downloaded.
     * @param total         The final progress value.
     */
    public abstract generateProgressPercentage(progress: number, currentIndex: number, total: number): number;

    /**
     * Iterate the {@class ThunderstoreCombo} array to perform the download for each mod.
     * Progress to the next one recursively once the callback received has been successful.
     *
     * @param settings  Instance of ManagerSettings.
     * @param entries   IterableIterator of entries for {@class ThunderstoreCombo} mods to download.
     * @param callback  See {@method download}
     */
    public abstract queueDownloadDependencies(settings: ManagerSettings, entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void): void

    /**
     * Generate the total count of mods to be downloaded. Cached mods are not included in this count unless download cache is disabled.
     *
     * @param settings  Instance of ManagerSettings.
     * @param list      List of mods generated by a dependency building method including the primary mod to be downloaded.
     */
    public abstract calculateInitialDownloadSize(settings: ManagerSettings, list: ThunderstoreCombo[]): number;

    /**
     * Perform the download of the given {@class ThunderstoreCombo}.
     *
     * @param combo     The current mod to download.
     * @param settings  Instance of ManagerSettings.
     * @param callback  See {@method download}
     */
    public abstract downloadAndSave(combo: ThunderstoreCombo, settings: ManagerSettings, callback: (progress: number, status: number, err: R2Error | null) => void): void;

    /**
     * Save the download buffer to a zip file in the cache.
     *
     * @param response  The download buffer.
     * @param combo     The mod being downloaded.
     * @param callback  Callback on if saving and extracting has been performed correctly. An error is provided if success is false.
     */
    public abstract saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void): void;

    /**
     * Check the cache to see if the mod has already been downloaded.
     * This will save bandwidth and disk writes if the cache is enabled.
     * To be used inside {@method calculateInitialDownloadSize}
     *
     * @param combo The mod being downloaded.
     */
    public abstract isVersionAlreadyDownloaded(combo: ThunderstoreCombo): boolean;

}
