import Vue from "vue";

export interface DownloadProgress {
    assignId: number;
    initialMods: string[];
    modName: string;
    progress: number;
    failed: boolean;
}


interface State {
    allVersions: [number, DownloadProgress][],
    assignId: number,
    downloadObject: DownloadProgress | null,
}

/**
 * State for mod downloads.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        allVersions: [],
        assignId: 0,
        downloadObject: null, // TODO: Check if the last element of allVersions can be used instead of this
    }),

    mutations: {
        setDownloadObject(state: State, downloadObject: DownloadProgress) {
            state.downloadObject = Object.assign({}, downloadObject);
        },
        pushDownloadObjectToAllVersions(state: State, params: { assignId: number, downloadObject: DownloadProgress }) {
            state.allVersions.push([params.assignId, params.downloadObject]);
        },
        updateDownloadObject(state: State, params: { assignId: number, downloadObject: DownloadProgress }) {
            Vue.set(state.allVersions, params.assignId, params.downloadObject);
        },
        increaseAssignId(state: State) {
            state.assignId++;
        }
    },
}
