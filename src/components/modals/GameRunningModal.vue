<template>
    <div id="gameRunningModal" :class="['modal', {'is-active': isOpen}]">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class='notification is-info'>
                <h3 class="title" v-if="isSteamGame">{{ $t('modals.running.launching', {displayName: activeGame.displayName }) }}</h3>
                <h3 class="title" v-else>{{ $t('modals.running.starting', {displayName: activeGame.displayName }) }}</h3>
                <h5 class="title is-5">{{ $t('modals.running.close') }}</h5>
                <div v-if="isSteamGame">
                    <p>{{ $t('modals.running.SteamStarting') }}</p>
                    <p>{{ $t('modals.running.patient') }}</p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="close"></button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Game from "../../model/game/Game";
import { StorePlatform } from "../../model/game/StorePlatform";

@Component
export default class GameRunningModal extends Vue {
    @Prop({required: true})
    readonly activeGame!: Game;

    isSteamGame = this.activeGame.activePlatform.storePlatform === StorePlatform.STEAM;

    close() {
        this.$store.commit('closeGameRunningModal');
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isGameRunningModalOpen;
    }
}
</script>
