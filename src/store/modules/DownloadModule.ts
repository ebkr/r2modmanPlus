import { ActionTree, GetterTree } from "vuex";

import ManagerSettings from "../../r2mm/manager/ManagerSettings";
import { State as RootState } from "../../store";

interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    downloadProgress: number;
    installProgress: number;
    failed: boolean;
}

interface UpdateObject {
    assignId: number;
    downloadProgress?: number;
    installProgress?: number;
    modName?: string;
    failed?: boolean;
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
        addDownload({state}, initialMods: string[]): number {
            const assignId = state.allDownloads.length;
            const downloadObject: DownloadProgress = {
                assignId,
                initialMods,
                modName: '',
                downloadProgress: 0,
                installProgress: 0,
                failed: false,
            };
            state.allDownloads = [...state.allDownloads, downloadObject];
            return assignId;
        },
        async toggleIgnoreCache({commit, rootGetters}) {
            const settings: ManagerSettings = rootGetters['settings'];
            settings.setIgnoreCache(!settings.getContext().global.ignoreCache);
            commit('setIgnoreCacheVuexOnly', settings.getContext().global.ignoreCache);
        },
    },

    getters: <GetterTree<State, RootState>>{
        activeDownloadCount(_state, getters) {
            return getters.activeDownloads.length;
        },
        activeDownloads(state) {
            return state.allDownloads.filter(
                dl =>
                    !dl.failed &&
                    !(dl.downloadProgress >= 100 && dl.installProgress >= 100)
            );
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
        updateDownload(state: State, update: UpdateObject) {
            const newDownloads = [...state.allDownloads];
            const index = newDownloads.findIndex((old: DownloadProgress) => {
                return old.assignId === update.assignId;
            });

            if (index === -1) {
                // The DownloadProgress by the ID from the update wasn't found at all.
                console.warn(`Couldn\'t find DownloadProgress object with assignId ${update.assignId}.`);
                return;
            }

            if (index !== update.assignId) {
                console.log(`There was a mismatch between download update\'s assign ID (${update.assignId}) and the index it was found at (${index}).`);
            }

            newDownloads[index] = {...newDownloads[index], ...update};
            state.allDownloads = newDownloads;
        },
        // Use actions.toggleIngoreCache to store the setting persistently.
        setIgnoreCacheVuexOnly(state: State, ignoreCache: boolean) {
            state.ignoreCache = ignoreCache;
        },
        setIsModProgressModalOpen(state: State, isModProgressModalOpen: boolean) {
            state.isModProgressModalOpen = isModProgressModalOpen;
        }
    },
}
