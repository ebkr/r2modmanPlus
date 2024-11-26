import { ActionTree, GetterTree } from 'vuex';

import StatusEnum from '../../model/enums/StatusEnum';
import R2Error from "../../model/errors/R2Error";
import ManifestV2 from "../../model/ManifestV2";
import { ImmutableProfile } from '../../model/Profile';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ThunderstoreDownloaderProvider from '../../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import ProfileInstallerProvider from "../../providers/ror2/installing/ProfileInstallerProvider";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { State as RootState } from '../index';

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
        activeInstallProgress(state): number | undefined {
            if (state.downloads.length > 0) {
                return state.downloads.slice(-1)[0].installProgress; // Last element of the array
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
        },
        updateInstallProgress(state: State, params: { progress: number, modName: string, status: number, err: R2Error | null }) {
            let installMod = state.downloads.find((progressItem) => progressItem.modName === params.modName);

            if (!installMod) {
                installMod = state.dependencyDownloads.find((progressItem) => progressItem.modName === params.modName);
            }

            if (installMod) {
                installMod.installProgress = params.progress;
                installMod.status = params.status;
                if (params.status === StatusEnum.FAILURE && params.err) {
                    installMod.error = params.err;
                }
            }
        }
    },
    actions: <ActionTree<State, RootState>>{
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

            const mods: ThunderstoreCombo[] = await ThunderstoreDownloaderProvider.instance.download(
                params.profile,
                params.mod.getMod(),
                params.mod.getVersion(),
                true,
                (progress, modName, status, err) => {
                    commit('updateDownloadProgress', {progress, modName, status, err});
                }
            );
            for (const mod of mods) {
                await commit(
                    'updateDownloadProgress',
                    { progress: 100, modName: mod.getMod().getName(), status: StatusEnum.SUCCESS, err: null }
                );
                await dispatch('installModAfterDownload', { profile: params.profile, mod: params.mod }).then(() => {
                    commit(
                        'updateInstallProgress',
                        { progress: 100, modName: mod.getMod().getName(), status: StatusEnum.SUCCESS, err: null }
                    );
                });
            }
        },
        async installModAfterDownload(
            {dispatch, getters, state, commit},
            params: {
                profile: ImmutableProfile,
                mod: ThunderstoreCombo,
            }
        ): Promise<void> {
            return new Promise(async (resolve, reject) => {
                const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(params.mod.getMod(), params.mod.getVersion());
                const profileModList = await ProfileModList.getModList(params.profile);
                if (profileModList instanceof R2Error) {
                    return reject(profileModList);
                }
                const modAlreadyInstalled = profileModList.find(
                    value => value.getName() === params.mod.getMod().getFullName()
                        && value.getVersionNumber().isEqualTo(params.mod.getVersion().getVersionNumber())
                );

                if (modAlreadyInstalled === undefined || !modAlreadyInstalled) {
                    const resolvedAuthorModNameString = `${manifestMod.getAuthorName()}-${manifestMod.getDisplayName()}`;
                    const olderInstallOfMod = profileModList.find(value => `${value.getAuthorName()}-${value.getDisplayName()}` === resolvedAuthorModNameString);
                    if (manifestMod.getName().toLowerCase() !== 'bbepis-bepinexpack') {
                        const result = await ProfileInstallerProvider.instance.uninstallMod(manifestMod, params.profile);
                        if (result instanceof R2Error) {
                            return reject(result);
                        }
                    }
                    const installError: R2Error | null = await ProfileInstallerProvider.instance.installMod(manifestMod, params.profile);
                    if (!(installError instanceof R2Error)) {
                        const newModList: ManifestV2[] | R2Error = await ProfileModList.addMod(manifestMod, params.profile);
                        if (newModList instanceof R2Error) {
                            return reject(newModList);
                        }
                    } else {
                        return reject(installError);
                    }
                    if (olderInstallOfMod !== undefined) {
                        if (!olderInstallOfMod.isEnabled()) {
                            await ProfileModList.updateMod(manifestMod, params.profile, async mod => {
                                mod.disable();
                            });
                            await ProfileInstallerProvider.instance.disableMod(manifestMod, params.profile);
                        }
                    }
                }
                return resolve();
            });
        }
    },
}
