<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import ThunderstoreMod from "../../model/ThunderstoreMod";
import Profile from "../../model/Profile";


@Component
export default class DownloadMixin extends Vue {
    get ignoreCache(): boolean {
        const settings = this.$store.getters['settings'];
        return settings.getContext().global.ignoreCache;
    }

    closeModal() {
        this.$store.commit("closeDownloadModModal");
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
