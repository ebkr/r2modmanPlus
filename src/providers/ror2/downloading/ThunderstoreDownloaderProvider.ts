import ProviderUtils from '../ProviderUtils';
import ThunderstoreVersion from '../../../model/ThunderstoreVersion';
import ThunderstoreMod from '../../../model/ThunderstoreMod';
import ThunderstoreCombo from '../../../model/ThunderstoreCombo';
import ManifestV2 from '../../../model/ManifestV2';
import R2Error from '../../../model/errors/R2Error';
import ExportMod from '../../../model/exports/ExportMod';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';

export default abstract class ThunderstoreDownloaderProvider {

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

    public abstract buildDependencySet(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[];

    public abstract buildDependencySetUsingLatest(mod: ThunderstoreVersion, allMods: ThunderstoreMod[], builder: ThunderstoreCombo[]): ThunderstoreCombo[];

    public abstract downloadLatestOfAll(mods: ManifestV2[], allMods: ThunderstoreMod[],
                               callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                               completedCallback: (modList: ThunderstoreCombo[]) => void): void;

    public abstract download(mod: ThunderstoreMod, modVersion: ThunderstoreVersion, allMods: ThunderstoreMod[],
                    callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                    completedCallback: (modList: ThunderstoreCombo[]) => void): void;

    public abstract downloadImportedMods(modList: ExportMod[],
                                callback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
                                completedCallback: (mods: ThunderstoreCombo[]) => void): void;

    public abstract generateProgressPercentage(progress: number, currentIndex: number, total: number): number;

    public abstract queueDownloadDependencies(settings: ManagerSettings, entries: IterableIterator<[number, ThunderstoreCombo]>, callback: (progress: number, modName: string, status: number, err: R2Error | null) => void): void

    public abstract calculateInitialDownloadSize(settings: ManagerSettings, list: ThunderstoreCombo[]): number;

    public abstract downloadAndSave(combo: ThunderstoreCombo, settings: ManagerSettings, callback: (progress: number, status: number, err: R2Error | null) => void): void;

    public abstract saveToFile(response: Buffer, combo: ThunderstoreCombo, callback: (success: boolean, error?: R2Error) => void): void;

    public abstract isVersionAlreadyDownloaded(combo: ThunderstoreCombo): boolean;

}
