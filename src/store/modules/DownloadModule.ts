import { GetterTree } from "vuex";

import { State as RootState } from "../../store";
import R2Error from "../../model/errors/R2Error";

export interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
    failed: boolean;
}


interface State {
    allDownloads: DownloadProgress[],
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allDownloads: [],
    }),

    getters: <GetterTree<State, RootState>>{
        activeDownloadCount(state) {
            const active = state.allDownloads.filter(
                dl => !dl.failed && dl.progress < 100
            );
            return active.length;
        },
        currentDownload(state) {
            return state.allDownloads[state.allDownloads.length-1] || null;
        },
    },

    mutations: {
        addDownload(state: State, downloadObject: DownloadProgress) {
            state.allDownloads = [...state.allDownloads, downloadObject];
        },
        updateDownload(state: State, downloadObject: DownloadProgress) {
            const newVersions = [...state.allDownloads];
            const index = newVersions.findIndex((oldDownloadObject: DownloadProgress) => {
                return oldDownloadObject.assignId === downloadObject.assignId;
            });
            if (index === -1) {
                throw new R2Error(
                    'Failed to update download status.',
                    'Download status object with a specified index was not found, which means that there\'s a mismatch between the download statuses in memory and what\'s being iterated over.',
                    'Try initiating the download again or restarting the app.'
                );
            }
            newVersions[index] = downloadObject;
            state.allDownloads = newVersions;
        },
    },
}
