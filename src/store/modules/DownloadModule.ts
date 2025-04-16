import { ActionTree, GetterTree } from "vuex";

import R2Error, { throwForR2Error } from "../../model/errors/R2Error";
import ManifestV2 from "../../model/ManifestV2";
import { ImmutableProfile } from "../../model/Profile";
import StatusEnum from "../../model/enums/StatusEnum";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ConflictManagementProvider from "../../providers/generic/installing/ConflictManagementProvider";
import ProfileInstallerProvider from "../../providers/ror2/installing/ProfileInstallerProvider";
import ThunderstoreDownloaderProvider from "../../providers/ror2/downloading/ThunderstoreDownloaderProvider";
import ManagerSettings from "../../r2mm/manager/ManagerSettings";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { State as RootState } from "../../store";
import * as DownloadUtils from "../../utils/DownloadUtils";

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

        async installMod({}, params: {profile: ImmutableProfile, combo: ThunderstoreCombo}) {
            const profileModList = await ProfileModList.getModList(params.profile);
            throwForR2Error(profileModList);

            const modAlreadyInstalled = (profileModList as ManifestV2[]).find(
                value => value.getName() === params.combo.getMod().getFullName()
                    && value.getVersionNumber().isEqualTo(params.combo.getVersion().getVersionNumber())
            );

            if (modAlreadyInstalled !== undefined && modAlreadyInstalled) {
                return;
            }

            const manifestMod = new ManifestV2().fromThunderstoreCombo(params.combo);
            const olderInstallOfMod = (profileModList as ManifestV2[]).find(value => value.getName() === manifestMod.getName());

            throwForR2Error(await ProfileInstallerProvider.instance.uninstallMod(manifestMod, params.profile));
            throwForR2Error(await ProfileInstallerProvider.instance.installMod(manifestMod, params.profile));
            throwForR2Error(await ProfileModList.addMod(manifestMod, params.profile));

            if (olderInstallOfMod === undefined || olderInstallOfMod.isEnabled()) {
                return;
            }

            await ProfileModList.updateMod(manifestMod, params.profile, async mod => {
                mod.disable();
            });
            await ProfileInstallerProvider.instance.disableMod(manifestMod, params.profile);
        },

        async installMods({commit, dispatch}, params: {
            downloadedMods: ThunderstoreCombo[],
            assignId: number,
            profile: ImmutableProfile,
        }) {
            await ProfileModList.requestLock(async () => {
                let currentDownloadIndex = 0;
                for (const combo of params.downloadedMods) {
                    try {
                        await dispatch('installMod', {profile: params.profile, combo});
                    } catch (e) {
                        throw R2Error.fromThrownValue(e, `Failed to install mod [${combo.getMod().getFullName()}]`);
                    }
                    commit('updateDownload', {
                        assignId: params.assignId,
                        modName: combo.getMod().getName(),
                        installProgress: DownloadUtils.generateProgressPercentage(100, currentDownloadIndex, params.downloadedMods.length)
                    });
                    currentDownloadIndex++;
                }

                const modList = await ProfileModList.getModList(params.profile);
                throwForR2Error(modList);
                throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts((modList as ManifestV2[]), params.profile));
            });
        },

        async downloadAndInstallSpecific({state, commit, dispatch}, params: {
            combo: ThunderstoreCombo,
            profile: ImmutableProfile
        }) {
            const assignId = await dispatch('addDownload', [`${params.combo.getMod().getName()} (${params.combo.getVersion().getVersionNumber().toString()})`]);

            try {
                const downloadedMods = await ThunderstoreDownloaderProvider.instance.download(
                    params.profile,
                    params.combo,
                    state.ignoreCache,
                    (downloadProgress: number, modName: string, status: number, err: R2Error | null) => {
                        dispatch('downloadProgressCallback', { assignId, downloadProgress, modName, status, err });
                    }
                );
                await dispatch('installMods', {downloadedMods, assignId, profile: params.profile});
            } catch (e) {
                commit('updateDownload', { assignId, failed: true });
                throw e;
            }
        },

        async downloadProgressCallback({commit}, params: {
            assignId: number,
            downloadProgress: number,
            modName: string,
            status: number,
            err: R2Error | null
        }) {
            if (params.status === StatusEnum.FAILURE) {
                commit('setIsModProgressModalOpen', false);
                commit('updateDownload', {assignId: params.assignId, failed: true});
                if (params.err !== null) {
                    DownloadUtils.addSolutionsToError(params.err);
                    throw params.err;
                }
            } else if (params.status === StatusEnum.PENDING || params.status === StatusEnum.SUCCESS) {
                commit('updateDownload', {assignId: params.assignId, modName: params.modName, downloadProgress: params.downloadProgress});
            }
        },

    },

    getters: <GetterTree<State, RootState>>{
        activeDownloadCount(_state, getters) {
            return getters.activeDownloads.length;
        },
        activeDownloads(state) {
            return getOnlyActiveDownloads(state.allDownloads);
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
        removeDownload(state: State, download: UpdateObject) {
            const index = getIndexOfDownloadProgress(state.allDownloads, download.assignId);
            if (index > -1) {
                state.allDownloads.splice(index, 1);
            }
        },
        updateDownload(state: State, update: UpdateObject) {
            const index: number = getIndexOfDownloadProgress(state.allDownloads, update.assignId);
            if (index > -1) {
                const newDownloads = [...state.allDownloads];
                newDownloads[index] = {...newDownloads[index], ...update};
                state.allDownloads = newDownloads;
            }
        },
        // Use actions.toggleIngoreCache to store the setting persistently.
        setIgnoreCacheVuexOnly(state: State, ignoreCache: boolean) {
            state.ignoreCache = ignoreCache;
        },
        setIsModProgressModalOpen(state: State, isModProgressModalOpen: boolean) {
            state.isModProgressModalOpen = isModProgressModalOpen;
        },
        removeAllInactive(state: State) {
            state.allDownloads = getOnlyActiveDownloads(state.allDownloads);
        }
    },
}

function getIndexOfDownloadProgress(allDownloads: DownloadProgress[], assignId: number): number {
    const index = [...allDownloads].findIndex((downloadProgress) => downloadProgress.assignId === assignId);

    if (index === -1) {
        console.warn(`Couldn't find DownloadProgress object with assignId ${assignId}.`);
    }

    return index;
}

function getOnlyActiveDownloads(downloads: DownloadProgress[]): DownloadProgress[] {
    return downloads.filter(dl =>
        !dl.failed &&
        !(dl.downloadProgress >= 100 && dl.installProgress >= 100)
    );
}
