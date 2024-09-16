import ZipProvider from "../providers/generic/zip/ZipProvider";
import path from "path";
import Profile from "../model/Profile";
import ExportFormat from "../model/exports/ExportFormat";
import FsProvider from "../providers/generic/file/FsProvider";
import FileUtils from "../utils/FileUtils";
import { Dispatch, Store } from "vuex";
import ExportMod from "../model/exports/ExportMod";
import * as PackageDb from "../r2mm/manager/PackageDexieStore";
import ThunderstoreDownloaderProvider from "../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import R2Error from "../model/errors/R2Error";
import ManifestV2 from "../model/ManifestV2";
import ProfileModList from "../r2mm/mods/ProfileModList";
import ProfileInstallerProvider from "../providers/ror2/installing/ProfileInstallerProvider";
import ThunderstoreMod from "../model/ThunderstoreMod";
import ThunderstoreVersion from "../model/ThunderstoreVersion";
import ImportProfileModal from "components/profiles-modals/ImportProfileModal.vue";

const PROFILE_UPDATE_DIRECTORY = "_profile_update";

// When creating, the flow is:
// 1. Creates an EventListener which gets triggered after the user has created a new profile. The callback then:
// 2. Downloads (and extracts) the mods to the profile
//
// When updating, the flow is:
// 1. Creates an EventListener which gets triggered after the user has selected the old profile to be updated. The callback then:
// 2. Deletes the temporary profile (called _profile_update) if it exists (leftover from previous failed run etc.)
// 3. Downloads (and extracts) the mods to temporary profile
// 4. Deletes the old profile (including the folder on disk)
// 5. Renames temporary profile to the chosen profile's name
export const installProfileToFileSystem = async (
    eventProfileName: string,
    parsed: ExportFormat,
    isUpdate: boolean,
    files: string[],
    modal: ImportProfileModal,
    activeProfile: Profile,
    closeModal: Function,
    setIsProfileBeingImported: Function,
    setActiveProfileName: Function,
    setPercentageImported: Function,
    downloadProgressCallback: (progress: number, modName: string, status: number, err: R2Error | null) => void
) => {
    if (eventProfileName == '') {
        return;
    }
    let profileName: string = eventProfileName;

    if (isUpdate) {
        await prepareTemporaryDirectoryForUpdating(modal.$store.dispatch);
        profileName = PROFILE_UPDATE_DIRECTORY;
    }

    setIsProfileBeingImported(parsed.getMods().length > 0);

    setTimeout(async () => {
        await downloadImportedProfileMods(
            parsed.getMods(),
            modal.$store,
            activeProfile,
            closeModal,
            setPercentageImported,
            setIsProfileBeingImported,
            downloadProgressCallback,
            () => modsDownloadedCallback(modal, files, profileName, eventProfileName, isUpdate, setActiveProfileName)
        );
    }, 100);
};

export const prepareTemporaryDirectoryForUpdating = async (dispatch: Dispatch) => {
    let fs = FsProvider.instance;
    if (await fs.exists(path.join(Profile.getDirectory(), PROFILE_UPDATE_DIRECTORY))) {
        await FileUtils.emptyDirectory(path.join(Profile.getDirectory(), PROFILE_UPDATE_DIRECTORY));
        await fs.rmdir(path.join(Profile.getDirectory(), PROFILE_UPDATE_DIRECTORY));
    }
    await dispatch('profiles/setSelectedProfile', {
        profileName: PROFILE_UPDATE_DIRECTORY,
        prewarmCache: true
    });
};

export const modsDownloadedCallback = async (
    modal: ImportProfileModal,
    files: string[],
    profileName: string,
    eventProfileName: any,
    isUpdate: boolean,
    setActiveProfileName: Function
) => {
    if (files[0].endsWith('.r2z')) {
        await extractZippedProfileFile(files[0], profileName);
    }
    if (isUpdate) {
        await cleanUpTemporaryDirectoryAfterUpdating(eventProfileName, setActiveProfileName)
    }
    await modal.$store.dispatch('profiles/setSelectedProfile', {
        profileName: eventProfileName,
        prewarmCache: true
    });
};

export const cleanUpTemporaryDirectoryAfterUpdating = async (eventProfileName: string, setActiveProfileName: Function) => {
    setActiveProfileName(eventProfileName);
    try {
        await FileUtils.emptyDirectory(path.join(Profile.getDirectory(), eventProfileName));
    } catch (e) {
        console.log("Failed to empty directory:", e);
    }
    let fs = FsProvider.instance;
    await fs.rmdir(path.join(Profile.getDirectory(), eventProfileName));
    await fs.rename(path.join(Profile.getDirectory(), PROFILE_UPDATE_DIRECTORY), path.join(Profile.getDirectory(), eventProfileName));
};


export const downloadImportedProfileMods = async (
    modList: ExportMod[],
    store: Store<any>,
    activeProfile: Profile,
    closeModal: Function,
    setPercentageImported: Function,
    setIsProfileBeingImported: Function,
    downloadProgressCallback: (progress: number, modName: string, status: number, err: R2Error | null) => void,
    callback: Function
) => {
    const settings = store.getters['settings'];
    const ignoreCache = settings.getContext().global.ignoreCache;
    const allMods = await PackageDb.getPackagesByNames(
        store.state.activeGame.internalFolderName,
        modList.map((m) => m.getName())
    );

    setPercentageImported(0);

    ThunderstoreDownloaderProvider.instance.downloadImportedMods(
        modList,
        allMods,
        ignoreCache,
        downloadProgressCallback,
        async (comboList: ThunderstoreCombo[]) => {
            await downloadCompletedCallback(comboList, modList, store, setIsProfileBeingImported, activeProfile, closeModal, callback);
        }
    );
};

export const downloadCompletedCallback = async (
    comboList: ThunderstoreCombo[],
    modList: ExportMod[],
    store: Store<any>,
    setIsProfileBeingImported: Function,
    activeProfile: Profile,
    closeModal: Function,
    callback: Function
) => {
    let keepIterating = true;
    for (const comboMod of comboList) {
        if (!keepIterating) {
            return;
        }
        const installResult: R2Error | ManifestV2 = await installModAfterDownload(comboMod.getMod(), comboMod.getVersion(), activeProfile);
        if (installResult instanceof R2Error) {
            store.commit('error/handleError', installResult);
            keepIterating = false;
            setIsProfileBeingImported(false);
            return;
        }
        await disableDisabledMods(modList, comboMod, activeProfile, installResult);
    }

    await callback();
    setIsProfileBeingImported(false);
    closeModal();
};

export const disableDisabledMods = async (
    modList: ExportMod[],
    comboMod: ThunderstoreCombo,
    activeProfile: Profile,
    installResult: ManifestV2
) => {
    for (const imported of modList) {
        if (imported.getName() == comboMod.getMod().getFullName() && !imported.isEnabled()) {
            await ProfileModList.updateMod(installResult, activeProfile, async (modToDisable: ManifestV2) => {
                // Need to enable temporarily so the manager doesn't think it's re-disabling a disabled mod.
                modToDisable.enable();
                await ProfileInstallerProvider.instance.disableMod(modToDisable, activeProfile);
                modToDisable.disable();
            });
        }
    }
};

export const installModAfterDownload = async (
    mod: ThunderstoreMod,
    version: ThunderstoreVersion,
    activeProfile: Profile
): Promise<R2Error | ManifestV2> => {
    const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
    const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, activeProfile);
    if (!(installError instanceof R2Error)) {
        const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, activeProfile);
        if (newModList instanceof R2Error) {
            return newModList;
        }
        return manifestMod;
    } else {
        // (mod failed to be placed in /{profile} directory)
        return installError;
    }
};

export const extractZippedProfileFile = async (file: string, profileName: string) => {
    const entries = await ZipProvider.instance.getEntries(file);
    for (const entry of entries) {
        if (entry.entryName.startsWith('config/') || entry.entryName.startsWith("config\\")) {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getDirectory(),
                    profileName,
                    'BepInEx'
                )
            );
        } else if (entry.entryName.toLowerCase() !== "export.r2x") {
            await ZipProvider.instance.extractEntryTo(
                file,
                entry.entryName,
                path.join(
                    Profile.getDirectory(),
                    profileName
                )
            )
        }
    }
};
