import { ActionTree, GetterTree } from "vuex";

import { State as RootState } from "../../store";
import R2Error from "../../model/errors/R2Error";

export interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
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
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allDownloads: [],
    }),

    actions: <ActionTree<State, RootState>>{
        addDownload({state}, initialMods: string[]): number {
            const assignId = state.allDownloads.length;
            const downloadObject: DownloadProgress = {
                assignId,
                initialMods,
                modName: '',
                progress: 0,
                failed: false,
            };
            state.allDownloads = [...state.allDownloads, downloadObject];
            return assignId;
        },
    },

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
        updateDownload(state: State, update: UpdateObject) {
            const newDownloads = [...state.allDownloads];
            if (newDownloads[update.assignId].assignId !== update.assignId) {
                throw new R2Error(
                    'Failed to update download status.',
                    `DownloadProgress with id of ${update.assignId} didn't have the correct assignId.`,
                    'Try initiating the download again or restarting the app.'
                );
            } else {
                newDownloads[update.assignId] = {...newDownloads[update.assignId], ...update};
                state.allDownloads = newDownloads;
            }
        },
    },
}
