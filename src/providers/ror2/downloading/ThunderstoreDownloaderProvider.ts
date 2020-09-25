import ProviderUtils from '../ProviderUtils';
import ThunderstoreVersion from '../../../model/ThunderstoreVersion';
import ThunderstoreMod from '../../../model/ThunderstoreMod';
import ThunderstoreCombo from '../../../model/ThunderstoreCombo';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import ExportMod from '../../../model/exports/ExportMod';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';

export default class ThunderstoreDownloaderProvider {

    static provider: () => ThunderstoreDownloaderProvider;

    static provide(provided: () => ThunderstoreDownloaderProvider): void {
        this.provider = provided;
    }

    public static get instance(): ThunderstoreDownloaderProvider {
        if (ThunderstoreDownloaderProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("ThunderstoreDownloaderProvider");
        }
        return ThunderstoreDownloaderProvider.provider();
    }

    public buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "buildDependencySet");
    }

    public buildDependencySetUsingLatest(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[] {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "buildDependencySetUsingLatest");
    }

    public downloadLatestOfAll(mods: ManifestV2[], allMods: ThunderstoreMod[],
                               callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                               completedCallback: (modList: ThunderstoreCombo[]) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "downloadLatestOfAll");
    }

    public download(mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[],
                    callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                    completedCallback: (modList: ThunderstoreCombo[]) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "download");
    }

    public downloadImportedMods(modList: ExportMod[],
                                callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                completedCallback: (mods: ThunderstoreCombo[]) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "downloadImportedMods");
    }

    public generateProgressPercentage(progress: number, currentIndex: number, total: number): number {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "generateProgressPercentage");
    }

    public queueDownloadDependencies(settings: ManagerSettings, entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "queueDownloadDependencies");
    }

    public calculateInitialDownloadSize(settings: ManagerSettings, list: ThunderstoreCombo[]): number {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "calculateInitialDownloadSize");
    }

    public downloadAndSave(combo: ThunderstoreCombo, settings: ManagerSettings, callback: (progress: number, status: number, err: R2Error | null) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "downloadAndSave");
    }

    public saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void) {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "saveToFile");
    }

    public isVersionAlreadyDownloaded(combo: ThunderstoreCombo): boolean  {
        throw ProviderUtils.throwMethodError(ThunderstoreDownloaderProvider.instance, this.constructor.name, "isVersionAlreadyDownloaded");
    }

}
