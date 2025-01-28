<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Store } from "vuex";

import StatusEnum from "../../model/enums/StatusEnum";
import R2Error, { throwForR2Error } from "../../model/errors/R2Error";
import Game from "../../model/game/Game";
import ManifestV2 from "../../model/ManifestV2";
import Profile, { ImmutableProfile } from "../../model/Profile";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ThunderstoreMod from "../../model/ThunderstoreMod";
import ConflictManagementProvider from "../../providers/generic/installing/ConflictManagementProvider";
import ProfileModList from "../../r2mm/mods/ProfileModList";
import { installModsToProfile } from "../../utils/ProfileUtils";


@Component
export default class DownloadMixin extends Vue {

    get activeGame(): Game {
        return this.$store.state.activeGame;
    }

    closeModal() {
        this.$store.commit("closeDownloadModModal");
    }

    setIsModProgressModalOpen(open: boolean): void {
        this.$store.commit('download/setIsModProgressModalOpen', open);
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isDownloadModModalOpen;
    }

    get ignoreCache(): boolean {
        const settings = this.$store.getters['settings'];
        return settings.getContext().global.ignoreCache;
    }

    get thunderstoreMod(): ThunderstoreMod | null {
        return this.$store.state.modals.downloadModModalMod;
    }

    get profile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    }

    async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[], assignId: number): Promise<void> {
        try {
            await this.installModsAndResolveConflicts(downloadedMods, this.profile.asImmutableProfile(), assignId);
        } catch (e) {
            this.$store.commit('download/updateDownload', {assignId, failed: true});
            this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    }

    static downloadProgressCallback(
        store: Store<any>,
        assignId: number,
        downloadProgress: number,
        modName: string,
        status: number,
        err: R2Error | null,
        closeModProgressModal?: () => void,
    ) {
        if (status === StatusEnum.FAILURE) {
            if (closeModProgressModal !== undefined) {
                closeModProgressModal();
            }
            store.commit('download/updateDownload', {assignId, failed: true});
            if (err !== null) {
                DownloadMixin.addSolutionsToError(err);
                throw err;
            }
        } else if (status === StatusEnum.PENDING || status === StatusEnum.SUCCESS) {
            store.commit('download/updateDownload', {assignId, downloadProgress, modName});
        }
    }

    async installModsAndResolveConflicts(
        downloadedMods: ThunderstoreCombo[],
        profile: ImmutableProfile,
        assignId: number
    ): Promise<void> {
        await ProfileModList.requestLock(async () => {
            const modList: ManifestV2[] = await installModsToProfile(downloadedMods, profile, undefined,(status, progress) => {
                this.$store.commit('download/updateDownload', {assignId, installProgress: progress});
            });
            await this.$store.dispatch('profile/updateModList', modList);
            throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts(modList, profile));
        });
    }

    static addSolutionsToError(err: R2Error): void {
        // Sanity check typing.
        if (!(err instanceof R2Error)) {
            return;
        }

        if (
            err.name.includes("Failed to download mod") ||
            err.name.includes("System.Net.WebException")
        ) {
            err.solution = "Try toggling the preferred Thunderstore CDN in the settings";
        }

        if (err.message.includes("System.IO.PathTooLongException")) {
            err.solution = 'Using "Change data folder" option in the settings to select a shorter path might solve the issue';
        }
    }
}
</script>
