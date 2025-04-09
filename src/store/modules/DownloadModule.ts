import { ActionTree, GetterTree } from "vuex";

import { throwForR2Error } from "../../model/errors/R2Error";
import ManifestV2 from "../../model/ManifestV2";
import { ImmutableProfile } from "../../model/Profile";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ProfileInstallerProvider from "../../providers/ror2/installing/ProfileInstallerProvider";
import ManagerSettings from "../../r2mm/manager/ManagerSettings";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { State as RootState } from "../../store";

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
        async installModAfterDownload({}, params: {profile: ImmutableProfile, combo: ThunderstoreCombo}) {
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
        }
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
