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
}

/**
 * State for Mod Downloading/Installation.
 */
export default {
    namespaced: true,

    state: (): State => ({
        downloads: [],
    }),

    getters: <GetterTree<State, RootState>>{
        allDownloads(state): ProgressItem[] {
            return state.downloads;
        },
        activeDownload(state): ProgressItem {
            return state.downloads.slice(-1)[0]; // Last element of the array
        },
        activeDownloadProgress(state): number | undefined {
            if(state.downloads.length > 0) {
                return state.downloads.slice(-1)[0].downloadProgress; // Last element of the array
            }
        },
        downloadsInProgress(state): ProgressItem[] {
            return state.downloads.filter((progressItem) => progressItem.status = StatusEnum.PENDING);
        },
        finishedDownloads(state): ProgressItem[] {
            return state.downloads.filter((progressItem) => progressItem.status = StatusEnum.SUCCESS);
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

            return new Promise((resolve, reject) => {
                ThunderstoreDownloaderProvider.instance.download(
                    params.profile,
                    params.mod.getMod(),
                    params.mod.getVersion(),
                    true,
                    (progress, modName, status, err) => {
                        let downloadMod = state.downloads.find((progressItem) => progressItem.modName === modName);

                        if (!downloadMod) {
                            commit('addDownload', modName);
                            downloadMod = state.downloads.find((progressItem) => progressItem.modName === modName);
                        }
                        if (!downloadMod) {
                            reject(err);
                            return;
                        }

                        if (status === StatusEnum.FAILURE && err) {
                            downloadMod.error = err;
                        }
                        if (status === StatusEnum.PENDING) {
                            downloadMod.downloadProgress = progress;
                        }
                    },
                    (mods) => {
                        mods.forEach((mod) => {
                            const downloadMod = state.downloads.find((progressItem) => progressItem.modName === mod.getMod().getName());

                            if (!downloadMod) {
                                reject();
                                return;
                            }
                            downloadMod.downloadProgress = 100;
                            downloadMod.status = StatusEnum.SUCCESS;
                        });
                        resolve(mods);
                    }
                );
            });
        },
    },
}
