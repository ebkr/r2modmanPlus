<template>
    <div id="settings-loader">
        <slot v-if="isLoaded" />

        <div v-else :class="['modal', 'z-top', {'is-active': error}]">
            <div class="modal-content">
                <div class="notification is-danger">
                    <h3 class="title">Error</h3>
                    <h5 class="title is-5">{{error && error.name}}</h5>
                    <p>{{error && error.message}}</p>
                    <div v-if="error && error.solution">
                        <br/>
                        <h5 class="title is-5">Suggestion</h5>
                        <p>{{error && error.solution}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import R2Error from "../model/errors/R2Error";
import GameManager from "../model/game/GameManager";
import ManagerSettings from "../r2mm/manager/ManagerSettings";

const url = "https://github.com/ebkr/r2modmanPlus/wiki/Error:-White-or-blank-game-select-screen-on-startup";
const solution = `Resetting settings might help. For more information, see ${url}`;

@Component
export default class SettingsLoader extends Vue {
    @Prop({required: true})
    private logError!: (error: R2Error) => void;

    error: R2Error|null = null;
    isLoaded = false;

    handleError(name: string, message: string, solution: string|null = null) {
        this.error = new R2Error(name, message, solution);
        this.logError(this.error);
    }

    async created() {
        let defaultGame;
        let settings;
        let error;
        
        try {
            defaultGame = getDefaultGame();
        } catch (e) {
            this.handleError("Failed to read default game", `${e}`);
            return;
        }

        try {
            settings = await ManagerSettings.getSingleton(defaultGame);
        } catch (e) {
            this.handleError("Failed to read ManagerSettings", `${e}`, solution);
            return;
        }

        try {
            error = await settings.load();
        } catch (e) {
            this.handleError("Failed to load ManagerSettings", `${e}`, solution);
            return;
        }

        if (error) {
            this.handleError(error.name, error.message, solution);
            return;
        }

        this.isLoaded = true;
    }
}

const getDefaultGame = () => {
    const defaultGame = GameManager.unsetGame();

    // Don't trust the non-null asserted typing of .unsetGame().
    if (defaultGame === undefined) {
        throw new Error("GameManager.unsetGame() returned undefined");
    }

    return defaultGame;
};

</script>
