import { getStore } from '../../providers/generic/store/StoreProvider';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import R2Error, { throwForR2Error } from '../../model/errors/R2Error';
import { ImmutableProfile } from '../../model/Profile';
import ProfileModList from '../../r2mm/mods/ProfileModList';
import { installModsToProfile } from '../../utils/ProfileUtils';
import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import { computed } from 'vue';

export function useDownloadComposable() {
    const store = getStore<any>();

    function closeModal() {
        store.commit("closeDownloadModModal");
    }

    function setIsModProgressModalOpen(open: boolean): void {
        store.commit('download/setIsModProgressModalOpen', open);
    }

    async function downloadCompletedCallback(downloadedMods: ThunderstoreCombo[], downloadId: number): Promise<void> {
        try {
            store.commit('download/setInstalling', downloadId);
            await installModsAndResolveConflicts(downloadedMods, store.getters['profile/activeProfile'].asImmutableProfile(), downloadId);
            store.commit('download/setDone', downloadId);
        } catch (e) {
            store.commit('download/setFailed', downloadId);
            store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    }

    async function installModsAndResolveConflicts(
        downloadedMods: ThunderstoreCombo[],
        profile: ImmutableProfile,
        downloadId: number
    ): Promise<void> {
        await ProfileModList.requestLock(async () => {
            try {
                const modList = await installModsToProfile(downloadedMods, profile, undefined, (status, modName, installProgress) => {
                    store.commit('download/updateDownload', {downloadId, modName, installProgress});
                });
                throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts(modList, profile));
            } catch (e) {
                throw e;
            } finally {
                // Update the mod list shown in the UI. installModsToProfile()
                // attempted to save partial changes to disk even if some of
                // the (un)installations failed.
                store.dispatch('profile/tryLoadModListFromDisk');
            }
        });
    }

    return {closeModal, setIsModProgressModalOpen, downloadCompletedCallback}
}
