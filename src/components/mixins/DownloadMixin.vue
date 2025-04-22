<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error, { throwForR2Error } from "../../model/errors/R2Error";
import Game from "../../model/game/Game";
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

    get thunderstoreMod(): ThunderstoreMod | null {
        return this.$store.state.modals.downloadModModalMod;
    }

    get profile(): Profile {
        return this.$store.getters['profile/activeProfile'];
    }

    async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[], downloadId: number): Promise<void> {
        try {
            await this.installModsAndResolveConflicts(downloadedMods, this.profile.asImmutableProfile(), downloadId);
        } catch (e) {
            this.$store.commit('download/updateDownload', {downloadId, failed: true});
            this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
    }

    async installModsAndResolveConflicts(
        downloadedMods: ThunderstoreCombo[],
        profile: ImmutableProfile,
        downloadId: number
    ): Promise<void> {
        await ProfileModList.requestLock(async () => {
            try {
                const modList = await installModsToProfile(downloadedMods, profile, undefined, (status, modName, installProgress) => {
                    this.$store.commit('download/updateDownload', {downloadId, modName, installProgress});
                });
                throwForR2Error(await ConflictManagementProvider.instance.resolveConflicts(modList, profile));
            } catch (e) {
                throw e;
            } finally {
                // Update the mod list shown in the UI. installModsToProfile()
                // attempted to save partial changes to disk even if some of
                // the (un)installations failed.
                this.$store.dispatch('profile/tryLoadModListFromDisk');
            }
        });
    }
}
</script>
