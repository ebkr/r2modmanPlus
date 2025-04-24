<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import Game from "../../model/game/Game";
import Profile from "../../model/Profile";
import ThunderstoreMod from "../../model/ThunderstoreMod";


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
}
</script>
