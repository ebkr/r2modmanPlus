import { ActionTree, GetterTree } from "vuex";
import UUID from 'uuid-js';

import Game from "../../model/game/Game";
import R2Error, { throwForR2Error } from "../../model/errors/R2Error";
import { ImmutableProfile } from "../../model/Profile";
import { DownloadStatusEnum } from "../../model/enums/DownloadStatusEnum";
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
    installMode: InstallMode;
    game: Game;
    profile: ImmutableProfile;
    modName: string;
    downloadProgress: number;
    downloadedSize: number;
    totalDownloadSize: number;
    installProgress: number;
    status: DownloadStatusEnum;
}

interface UpdateObject {
    downloadId: UUID;
    downloadProgress?: number;
    downloadedSize?: number;
    installProgress?: number;
    modName?: string;
    status?: DownloadStatusEnum;
}

interface State {
    allDownloads: DownloadProgress[],
    ignoreCache: boolean,
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allDownloads: [],
        ignoreCache: false,
    }),

    actions: <ActionTree<State, RootState>>{
        retryDownload({commit, dispatch}, params: { download: DownloadProgress, hideModal?: boolean }) {
            const { game, profile, installMode, initialMods } = params.download;
            dispatch('downloadAndInstallCombos', {
                combos: initialMods,
                game,
                profile,
                installMode,
                hideModal: params.hideModal
            });
            commit('removeDownload', params.download);
        },

        retryDownloadById({state, commit, dispatch}, downloadId: UUID) {
            const download = state.allDownloads.find((d: DownloadProgress) => d.downloadId === downloadId);
            if (!download) {
                commit('error/handleError',
                    new R2Error('Download not found', 'Tried to retry a download, but it wasn\'t found in the list of downloads.'),
                    { root: true }
                );
                return;
            }
            dispatch('retryDownload', { download });
        },

        async _addDownload({state, commit}, params: {
            initialMods: ThunderstoreCombo[],
            modsWithDependencies: ThunderstoreCombo[],
            installMode: InstallMode,
            game: Game,
            profile: ImmutableProfile
        }): Promise<UUID> {
            const { initialMods, modsWithDependencies, installMode, game, profile } = params;
            const downloadId = UUID.create().toString();
            const totalDownloadSize = await DownloadUtils.getTotalDownloadSizeInBytes(modsWithDependencies, state.ignoreCache);
            const downloadObject: DownloadProgress = {
                downloadId,
                initialMods: [...initialMods],
                installMode,
                game,
                profile,
                modName: '',  // Mod currently being downloaded/installed.
                totalDownloadSize,
                downloadedSize: 0,
                downloadProgress: 0,
                installProgress: 0,
                status: DownloadStatusEnum.DOWNLOADING
            };
            commit('addDownload', downloadObject);
            return downloadId;
        },

        async toggleIgnoreCache({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            settings.setIgnoreCache(!settings.getContext().global.ignoreCache);
            commit('setIgnoreCacheVuexOnly', settings.getContext().global.ignoreCache);
        },

        async downloadAndInstallCombos({commit, dispatch, rootGetters}, params: {
            combos: ThunderstoreCombo[],
            game: Game,
            installMode: InstallMode,
            profile: ImmutableProfile,
            hideModal?: boolean
        }) {
            const { combos, game, installMode, profile, hideModal } = params;
            let downloadId: UUID | undefined;

            try {
                const installedMods = throwForR2Error(await ProfileModList.getModList(profile));
                const modsWithDependencies = await getFullDependencyList(combos, game, installedMods, installMode);
                downloadId = await dispatch('_addDownload', { initialMods: combos, modsWithDependencies, installMode, game, profile });

                if (!hideModal) {
                    commit('openDownloadProgressModal', null, { root: true });
                }

                await dispatch('_download', { combos: modsWithDependencies, downloadId });

                commit('setInstalling', downloadId);
                await dispatch('_installModsAndResolveConflicts', { combos: modsWithDependencies, profile, downloadId });
                commit('setInstalled', downloadId);
            } catch (e) {
                const r2Error = R2Error.fromThrownValue(e);
                if (downloadId) {
                    commit('setFailed', downloadId);
                    if (profile.getProfilePath() === rootGetters['profile/activeProfile'].getProfilePath()) {
                        r2Error.setAction({
                            label: 'Retry',
                            function: () => dispatch('retryDownloadById', downloadId)
                        });
                    }
                }
                commit('error/handleError', r2Error, { root: true });
            } finally {
                if (!hideModal) {
                    commit('closeDownloadProgressModal', null, { root: true });
                }
            }
        },

        async downloadToCache({state}, params: {
            combos: ThunderstoreCombo[],
            progressCallback: (downloadedSize: number) => void
        }) {
            const { combos, progressCallback } = params;
            await ThunderstoreDownloaderProvider.instance.download(combos, state.ignoreCache, progressCallback);
        },

        async _download({state, commit, dispatch}, params: {
            combos: ThunderstoreCombo[],
            downloadId: UUID
        }) {
            try {
                await ThunderstoreDownloaderProvider.instance.download(
                    params.combos,
                    state.ignoreCache,
                    (downloadedSize, modName, status, err) => {
                        dispatch('_downloadProgressCallback', { downloadId: params.downloadId, downloadedSize, modName, status, err });
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
            downloadedSize: number,
            modName: string,
            status: DownloadStatusEnum,
            err: R2Error | null
        }) {
            const { downloadId, downloadedSize, modName, status, err} = params;

            if (status === DownloadStatusEnum.FAILED) {
                commit('closeDownloadProgressModal', null, { root: true });
                commit('setFailed', downloadId);
                if (err !== null) {
                    DownloadUtils.addSolutionsToError(err);
                    throw err;
                }
            } else if (DownloadUtils.statusIsDownloadOrExtract(status)) {
                commit('updateDownload', { downloadId, modName, downloadedSize, status });
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
        currentDownload(state) {
            return state.allDownloads[state.allDownloads.length-1] || null;
        },
        newestActiveDownload(_state, getters) {
            return getters.activeDownloads[getters.activeDownloads.length-1] || null;
        },
        profileActiveDownloadCount(_state, getters) {
            return getters.profileActiveDownloads.length;
        },
        profileActiveDownloads(_state, getters) {
            return getOnlyActiveDownloads(getters.profileDownloads);
        },
        profileDownloads(state, _getters, _rootState, rootGetters) {
            return state.allDownloads.filter((dl: DownloadProgress) => {
                return dl.profile.getProfilePath() === rootGetters['profile/activeProfile'].getProfilePath();
            });
        },
        profileDownloadsNewestFirst(_state, getters) {
            return Array.from(getters.profileDownloads).reverse();
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
                if (update.downloadedSize !== undefined) {
                    update.downloadProgress = DownloadUtils.generateProgressPercentage(update.downloadedSize, newDownloads[index].totalDownloadSize);
                }
                newDownloads[index] = {...newDownloads[index], ...update};
                state.allDownloads = newDownloads;
            }
        },
        addDownload(state: State, download: DownloadProgress) {
            // @ts-ignore
            state.allDownloads = [...state.allDownloads, download];
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
        setInstalled(state: State, downloadId: number) {
            state.allDownloads = updateDownloadStatus(state.allDownloads, downloadId, DownloadStatusEnum.INSTALLED);
        },
        setFailed(state: State, downloadId: number) {
            state.allDownloads = updateDownloadStatus(state.allDownloads, downloadId, DownloadStatusEnum.FAILED);
        },
        // Use actions.toggleIngoreCache to store the setting persistently.
        setIgnoreCacheVuexOnly(state: State, ignoreCache: boolean) {
            state.ignoreCache = ignoreCache;
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
    const active = [
        DownloadStatusEnum.DOWNLOADING,
        DownloadStatusEnum.EXTRACTING,
        DownloadStatusEnum.EXTRACTED,
        DownloadStatusEnum.INSTALLING
    ];
    return downloads.filter(dl => active.includes(dl.status));
}

function updateDownloadStatus(downloads: DownloadProgress[], downloadId: UUID, status: DownloadStatusEnum): DownloadProgress[] {
    const index: number = getIndexOfDownloadProgress(downloads, downloadId);
    if (index > -1) {
        downloads[index].status = status;
    }
    return downloads;
}
