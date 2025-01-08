<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import R2Error from "../../model/errors/R2Error";
import Game from "../../model/game/Game";
import Profile from "../../model/Profile";
import ThunderstoreCombo from "../../model/ThunderstoreCombo";
import ThunderstoreMod from "../../model/ThunderstoreMod";
import { installModsAndResolveConflicts } from "../../utils/ProfileUtils";


@Component
export default class DownloadMixin extends Vue {

    downloadingMod: boolean = false;

    get activeGame(): Game {
        return this.$store.state.activeGame;
    }

    closeModal() {
        this.$store.commit("closeDownloadModModal");
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

    async downloadCompletedCallback(downloadedMods: ThunderstoreCombo[]): Promise<void> {
        try {
            await installModsAndResolveConflicts(downloadedMods, this.profile.asImmutableProfile(), this.$store);
        } catch (e) {
            this.$store.commit('error/handleError', R2Error.fromThrownValue(e));
        }
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
