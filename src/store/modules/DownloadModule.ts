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
            const index = newDownloads.findIndex((old: DownloadProgress) => {
                return old.assignId === update.assignId;
            });

            if (index === -1) {
                // The DownloadProgress by the ID from the update wasn't found at all.
                const err = new R2Error(
                    'Failed to update download status.',
                    `DownloadProgress with assign id of ${update.assignId} wasn't found.`,
                    'Try initiating the download again or restarting the app.'
                );
                // Only throw if the download failed, otherwise just console.log() it.
                if (update.failed) {
                    throw err;
                }
                console.warn(err);
                return;
            }

            if (index !== update.assignId) {
                // Just as a bonus, log if the DownloadProgress by the ID was located at the corresponding index of the array.
                console.log(`There was a mismatch between download update\'s assign ID (${update.assignId}) and the index it was found at (${index}).`);
            }

            newDownloads[update.assignId] = {...newDownloads[update.assignId], ...update};
            state.allDownloads = newDownloads;
        },
    },
}
