import { ActionTree, GetterTree } from "vuex";

import { State as RootState } from "../../store";
import R2Error from "../../model/errors/R2Error";

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
    progress?: number;
    modName?: string;
    failed?: boolean;
}

interface State {
    allDownloads: DownloadProgress[],
    isModProgressModalOpen: boolean,
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allDownloads: [],
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
    },

    getters: <GetterTree<State, RootState>>{
        activeDownloadCount(state) {
            const active = state.allDownloads.filter(
                dl => !dl.failed && dl.downloadProgress < 100 && dl.installProgress < 100
            );
            return active.length;
        },
        currentDownload(state) {
            return state.allDownloads[state.allDownloads.length-1] || null;
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
        setIsModProgressModalOpen(state: State, isModProgressModalOpen: boolean) {
            state.isModProgressModalOpen = isModProgressModalOpen;
        }
    },
}
