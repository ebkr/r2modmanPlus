import { ActionTree, GetterTree } from "vuex";
import UUID from 'uuid-js';

import Game from "../../model/game/Game";
import R2Error, { throwForR2Error } from "../../model/errors/R2Error";
import { ImmutableProfile } from "../../model/Profile";
import { DownloadStatusEnum } from "../../model/enums/DownloadStatusEnum";
import StatusEnum from "../../model/enums/StatusEnum";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ConflictManagementProvider from "../../providers/generic/installing/ConflictManagementProvider";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import ManagerSettings from "../../r2mm/manager/ManagerSettings";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { State as RootState } from "../../store";
import * as DownloadUtils from "../../utils/DownloadUtils";
import { getFullDependencyList, InstallMode } from "../../utils/DependencyUtils";
import { installModsToProfile } from "../../utils/ProfileUtils";

interface DownloadProgress {
    downloadId: UUID;
    initialMods: ThunderstoreCombo[];
    modName: string;
    downloadProgress: number;
    installProgress: number;
    status: DownloadStatusEnum;
}

interface UpdateObject {
    downloadId: UUID;
    downloadProgress?: number;
    installProgress?: number;
    modName?: string;
    status?: DownloadStatusEnum;
}

interface State {
    allDownloads: DownloadProgress[],
    ignoreCache: boolean,
    isModProgressModalOpen: boolean,
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allDownloads: [],
        ignoreCache: false,
        isModProgressModalOpen: false,
    }),

    actions: <ActionTree<State, RootState>>{
        _addDownload({state}, combos: ThunderstoreCombo[]): UUID {
            const downloadId = UUID.create();
            const downloadObject: DownloadProgress = {
                downloadId: downloadId,
                initialMods: [...combos],
                modName: '',
                downloadProgress: 0,
                installProgress: 0,
                status: DownloadStatusEnum.DOWNLOADING
            };
            state.allDownloads = [...state.allDownloads, downloadObject];
            return downloadId;
        },

        async toggleIgnoreCache({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            settings.setIgnoreCache(!settings.getContext().global.ignoreCache);
            commit('setIgnoreCacheVuexOnly', settings.getContext().global.ignoreCache);
        },

        async downloadAndInstallCombos({commit, dispatch}, params: {
            combos: ThunderstoreCombo[],
            game: Game,
            installMode: InstallMode,
            profile: ImmutableProfile
        }) {
            const { combos, game, installMode, profile } = params;
            let downloadId: UUID | undefined;

            try {
                downloadId = await dispatch('_addDownload', combos);
                const installedMods = throwForR2Error(await ProfileModList.getModList(profile));
                await getFullDependencyList(combos, game, installedMods, installMode);
                await dispatch('_download', { combos, downloadId })
                await dispatch('_installModsAndResolveConflicts', { combos, profile, downloadId });
            } catch (e) {
                if (downloadId) {
                    commit('setFailed', downloadId);
                }
                commit('error/handleError', R2Error.fromThrownValue(e), { root: true });
            } finally {
                commit('setIsModProgressModalOpen', false);
            }
        },

        async _download({state, commit, dispatch}, params: {
            combos: ThunderstoreCombo[],
            downloadId: UUID
        }) {
            try {
                await ThunderstoreDownloaderProvider.instance.download(
                    params.combos,
                    state.ignoreCache,
                    (downloadProgress, modName, status, err) => {
                        dispatch('_downloadProgressCallback', { downloadId: params.downloadId, downloadProgress, modName, status, err });
                    }
                );
            } catch (e) {
                commit('setFailed', params.downloadId);
                throw e;
            }
        },

        async _installModsAndResolveConflicts({commit, dispatch}, params: {
            combos: ThunderstoreCombo[],
            profile: ImmutableProfile,
            downloadId: UUID
        }): Promise<void> {
            const { combos, profile, downloadId } = params;

            await ProfileModList.requestLock(async () => {
                try {
                    const modList = await installModsToProfile(combos, profile, undefined, (_status, modName, installProgress) => {
                        commit('updateDownload', { downloadId, modName, installProgress });
                    });
                    throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts(modList, profile));
                } catch (e) {
                    throw e;
                } finally {
                    // Update the mod list shown in the UI. installModsToProfile()
                    // attempted to save partial changes to disk even if some of
                    // the (un)installations failed.
                    dispatch('profile/tryLoadModListFromDisk', undefined, { root: true });
                }
            });
        },

        async _downloadProgressCallback({commit}, params: {
            downloadId: UUID,
            downloadProgress: number,
            modName: string,
            status: number,
            err: R2Error | null
        }) {
            const { downloadId, downloadProgress, modName, status, err} = params;

            if (status === StatusEnum.FAILURE) {
                commit('setIsModProgressModalOpen', false);
                commit('setFailed', params.downloadId);
                if (params.err !== null) {
                    DownloadUtils.addSolutionsToError(params.err);
                    throw params.err;
                }
            } else if (status === StatusEnum.PENDING || status === StatusEnum.SUCCESS) {
                commit('updateDownload', { downloadId, modName, downloadProgress });
            }
        },
    },

    getters: <GetterTree<State, RootState>>{
        activeDownloadCount(_state, getters) {
            return getters.activeDownloads.length;
        },
        activeDownloads(state) {
            return getOnlyActiveDownloads(state.allDownloads);
        },
        conciseDownloadStatus(_state, getters) {
            if (getters.activeDownloadCount === 1 && getters.newestActiveDownload) {
                if (getters.newestActiveDownload.downloadProgress < 100) {
                    return `Downloading mods (${getters.newestActiveDownload.downloadProgress}%)`;
                } else {
                    return `Installing mods (${getters.newestActiveDownload.installProgress}%)`;
                }
            } else if (getters.activeDownloadCount > 1) {
                return `Downloading and installing ${getters.activeDownloadCount} mods...`;
            }
        },
        currentDownload(state) {
            return state.allDownloads[state.allDownloads.length-1] || null;
        },
        newestActiveDownload(_state, getters) {
            return getters.activeDownloads[getters.activeDownloads.length-1] || null;
        },
        newestFirst(state) {
            return Array.from(state.allDownloads).reverse();
        },
    },

    mutations: {
        removeDownload(state: State, download: UpdateObject) {
            const index = getIndexOfDownloadProgress(state.allDownloads, download.downloadId);
            if (index > -1) {
                state.allDownloads.splice(index, 1);
            }
        },
        updateDownload(state: State, update: UpdateObject) {
            const index: number = getIndexOfDownloadProgress(state.allDownloads, update.downloadId);
            if (index > -1) {
                const newDownloads = [...state.allDownloads];
                newDownloads[index] = {...newDownloads[index], ...update};
                state.allDownloads = newDownloads;
            }
        },
        setDone(state: State, downloadId: number) {
            state.allDownloads = updateDownloadStatus(state.allDownloads, downloadId, DownloadStatusEnum.DONE);
        },
        setFailed(state: State, downloadId: number) {
            state.allDownloads = updateDownloadStatus(state.allDownloads, downloadId, DownloadStatusEnum.FAILED);
        },
        setInstalling(state: State, downloadId: number) {
            state.allDownloads = updateDownloadStatus(state.allDownloads, downloadId, DownloadStatusEnum.INSTALLING);
        },
        // Use actions.toggleIngoreCache to store the setting persistently.
        setIgnoreCacheVuexOnly(state: State, ignoreCache: boolean) {
            state.ignoreCache = ignoreCache;
        },
        setIsModProgressModalOpen(state: State, isModProgressModalOpen: boolean) {
            state.isModProgressModalOpen = isModProgressModalOpen;
        },
        removeAllInactive(state: State) {
            state.allDownloads = getOnlyActiveDownloads(state.allDownloads);
        }
    },
}

function getIndexOfDownloadProgress(allDownloads: DownloadProgress[], downloadId: UUID): number {
    const index = [...allDownloads].findIndex((downloadProgress) => downloadProgress.downloadId === downloadId);

    if (index === -1) {
        console.warn(`Couldn't find DownloadProgress object with downloadId ${downloadId}.`);
    }

    return index;
}

function getOnlyActiveDownloads(downloads: DownloadProgress[]): DownloadProgress[] {
    const active = [DownloadStatusEnum.DOWNLOADING, DownloadStatusEnum.INSTALLING];
    return downloads.filter(dl => active.includes(dl.status));
}

function updateDownloadStatus(downloads: DownloadProgress[], downloadId: UUID, status: DownloadStatusEnum): DownloadProgress[] {
    const index: number = getIndexOfDownloadProgress(downloads, downloadId);
    if (index > -1) {
        downloads[index].status = status;
    }
    return downloads;
}
