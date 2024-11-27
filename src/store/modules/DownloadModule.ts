import {ActionTree, GetterTree} from 'vuex';

import {ImmutableProfile} from '../../model/Profile';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import {State as RootState} from '../index';
import R2Error from "../../model/errors/R2Error";

// TODO: Replace the "enum" in '../../model/enums/StatusEnum' with a proper enum like this one.
enum StatusEnum {
    FAILURE = 0,
    PENDING = 1,
    SUCCESS = 2,
}

export interface ProgressItem {
    modName: string;
    installProgress: number;
    downloadProgress: number;
    status: StatusEnum;
    error: R2Error | null;
}

interface State {
    downloads: ProgressItem[];
}

/**
 * State for Mod Downloading/Installation.
 */
export const DownloadModule = {
    namespaced: true,

    state: (): State => ({
        downloads: [],
    }),

    getters: <GetterTree<State, RootState>>{
        activeDownload(state): ProgressItem | undefined {
            return state.downloads.slice(-1)[0]; // Last element of the array
        },
    },
    mutations: {
        addDownload(state: State, modName: string) {
            state.downloads.push({
                modName: modName,
                installProgress: 0,
                downloadProgress: 0,
                status: StatusEnum.PENDING,
                error: null
            });
        },
        updateDownloadProgress(state: State, params: { progress: number, modName: string, status: number, err: R2Error | null }) {
            let downloadMod = state.downloads.find((progressItem) => progressItem.modName === params.modName);

            // Doesn't do anything when the downloaded mod is not found in the array (which means it is a dependency).
            // TODO: figure out if/how/where to track/display these dependencies' progresses.
            // Might be affected by removing the completedCallback as one way to do it is to have it return
            // a list of all of the downloaded mods (including the dependencies).

            if (downloadMod) {
                downloadMod.downloadProgress = params.progress;
                downloadMod.status = params.status;
                if (params.status === StatusEnum.FAILURE && params.err) {
                    // TODO: do something with these failed downloads, i.e. display the error(s) to the user.
                    downloadMod.error = params.err;
                }
            }
        }
    },
    actions: <ActionTree<State, RootState>>{

        //TODO: Do the installation
        async downloadAndInstallMod(
            {dispatch, getters, state, commit},
            params: {
                profile: ImmutableProfile,
                mod: ThunderstoreCombo,
            }
        ) {
            commit('addDownload', { modName: params.mod.getMod().getName() });

            ThunderstoreDownloaderProvider.instance.download(
                params.profile,
                params.mod.getMod(),
                params.mod.getVersion(),
                true,
                (progress, modName, status, err) => {
                    commit('updateDownloadProgress', { progress, modName, status, err });
                },
                //TODO: refactor to remove this completedCallback and just await for the return
                (mods) => {
                    mods.forEach((mod) => {
                        commit(
                            'updateDownloadProgress',
                            { progress: 100, modName: mod.getMod().getName(), status: StatusEnum.SUCCESS, err: null }
                        );
                    });
                }
            );
        },
    },
}
