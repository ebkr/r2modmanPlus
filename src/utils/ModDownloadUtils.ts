import { Store } from "vuex";

import StatusEnum from "../model/enums/StatusEnum";
import R2Error from "../model/errors/R2Error";
import Profile from "../model/Profile";
import ThunderstoreCombo from "../model/ThunderstoreCombo";
import ConflictManagementProvider from "../providers/generic/installing/ConflictManagementProvider";
import ProfileModList from "../r2mm/mods/ProfileModList";
import { installModsToProfile } from "../utils/ProfileUtils";

interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
    failed: boolean;
}

export async function downloadCompletedCallback(profile: Profile, downloadedMods: ThunderstoreCombo[], store: Store<any>) {
    const immutableProfile = profile.asImmutableProfile();
    await ProfileModList.requestLock(async () => {
        try {
            const modList = await installModsToProfile(downloadedMods, immutableProfile);
            await store.dispatch('profile/updateModList', modList);

            const err = await ConflictManagementProvider.instance.resolveConflicts(modList, profile);
            if (err instanceof R2Error) {
                throw err;
            }
        } catch (e) {
            store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    });
}

export async function downloadProgressCallback (
    currentAssignId: number,
    progress: number,
    modName: string,
    status: number,
    err: R2Error | null,
    initialMods: string[],
    downloadObject: DownloadProgress | null,
    setDownloadObject: Function,
    setDownloadingMod: Function,
    vueSetCallback: Function,
    allVersions: [number, DownloadProgress][]
) {
    const assignIndex = allVersions.findIndex(([number, val]) => number === currentAssignId);
    if (status === StatusEnum.FAILURE) {
        if (err !== null) {
            setDownloadingMod(false);
            const existing = allVersions[assignIndex]
            existing[1].failed = true;
            vueSetCallback(assignIndex, existing[1]);
            addSolutionsToError(err);
            throw(err);
        }
    } else if (status === StatusEnum.PENDING) {
        const obj = {
            progress: progress,
            initialMods: initialMods,
            modName: modName,
            assignId: currentAssignId,
            failed: false,
        }
        if (downloadObject!.assignId === currentAssignId) {
            setDownloadObject(Object.assign({}, obj));
        }
        vueSetCallback(assignIndex, obj);
    }
}
function addSolutionsToError(err: R2Error): void {
    // Sanity check typing.
    if (!(err instanceof R2Error)) {
        return;
    }

    if (
        err.name.includes("Failed to download mod") ||
        err.name.includes("System.Net.WebException")
    ) {
        err.solution = "Try toggling the preferred Thunderstore CDN in the settings";
    }

    if (err.message.includes("System.IO.PathTooLongException")) {
        err.solution = 'Using "Change data folder" option in the settings to select a shorter path might solve the issue';
    }
}
