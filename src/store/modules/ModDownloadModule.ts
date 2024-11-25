import {ActionTree, GetterTree} from 'vuex';

import StatusEnum from '../../model/enums/StatusEnum';
import {ImmutableProfile} from '../../model/Profile';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import {State as RootState} from '../index';
import R2Error from "../../model/errors/R2Error";

interface ProgressItem {
    modName: string;
    installProgress: number;
    downloadProgress: number;
    status: number; // StatusEnum
    error: R2Error | null;
}

interface State {
    downloads: ProgressItem[];
    dependencyDownloads: ProgressItem[];
}

/**
 * State for Mod Downloading/Installation.
 */
export default {
    namespaced: true,

    state: (): State => ({
        downloads: [],
        dependencyDownloads: [],
    }),

    getters: <GetterTree<State, RootState>>{
        allDownloads(state): ProgressItem[] {
            return state.downloads;
        },
        activeDownload(state): ProgressItem {
            return state.downloads.slice(-1)[0]; // Last element of the array
        },
        activeDownloadProgress(state): number | undefined {
            if (state.downloads.length > 0) {
                return state.downloads.slice(-1)[0].downloadProgress; // Last element of the array
            }
        },
        activeDownloadModName(state): string | undefined {
            if (state.downloads.length > 0) {
                return state.downloads.slice(-1)[0].modName; // Last element of the array
            }
        },
        activeDownloadProgressItem(state): ProgressItem | undefined {
            if (state.downloads.length > 0) {
                return state.downloads.slice(-1)[0]; // Last element of the array
            }
        },
    },
    mutations: {
        reset(state: State) {
            state.downloads = [];
            state.dependencyDownloads = [];
        },
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

            if (!downloadMod) {
                state.dependencyDownloads.push({
                    modName: params.modName,
                    installProgress: 0,
                    downloadProgress: 0,
                    status: StatusEnum.PENDING,
                    error: null
                });
                downloadMod = state.dependencyDownloads.find((progressItem) => progressItem.modName === params.modName);
            }

            if (downloadMod) {
                downloadMod.downloadProgress = params.progress;
                downloadMod.status = params.status;
                if (params.status === StatusEnum.FAILURE && params.err) {
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
            state.downloads.push({
                modName: params.mod.getMod().getName(),
                installProgress: 0,
                downloadProgress: 0,
                status: StatusEnum.PENDING,
                error: null
            });

            ThunderstoreDownloaderProvider.instance.download(
                params.profile,
                params.mod.getMod(),
                params.mod.getVersion(),
                true,
                (progress, modName, status, err) => {
                    commit('updateDownloadProgress', { progress, modName, status, err });
                },
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
