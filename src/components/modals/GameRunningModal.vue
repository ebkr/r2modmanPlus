<template>
    <div id="gameRunningModal" :class="['modal', {'is-active': isOpen}]">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class='notification is-info'>
                <h3 class="title" v-if="isSteamGame">{{ activeGame.displayName }} is launching via Steam</h3>
                <h3 class="title" v-else>{{ activeGame.displayName }} is starting</h3>
                <h5 class="title is-5">Close this message to continue modding.</h5>
                <div v-if="isSteamGame">
                    <p>If this is taking a while, it's likely due to Steam starting.</p>
                    <p>Please be patient, and have fun!</p>
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
