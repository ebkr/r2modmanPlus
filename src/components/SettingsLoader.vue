<template>
    <div id="settings-loader">
        <slot v-if="phase === PHASES.LOADED" />

        <div v-if="phase > PHASES.ERROR_STATES" class="modal z-top is-active">
            <div class="modal-content">
                <div class="notification is-danger">
                    <h3 class="title">Error</h3>
                    <h5 class="title is-5">{{error && error.name}}</h5>
                    <p>{{error && error.message}}</p>
                    <br />
                    <h5 class="title is-5">Suggestion</h5>

                    <p v-if="phase === PHASES.GAME_FAILED">
                        This is a problem with the mod manager itself.
                        If there's a newer version of the manager
                        available, try installing it.
                    </p>

                    <div v-else-if="phase === PHASES.SETTINGS_FAILED">
                        <p>
                            Loading of local user settings failed. You
                            can use the button below to reset the
                            settings, but note that all settings for all
                            games will be lost and this can't be undone.
                        </p>
                        <br />
                        <button @click="resetSettings" class="button is-white">
                            Reset settings
                        </button>
                    </div>

                    <p v-else-if="phase === PHASES.RESET_FAILED">
                        Resetting of the settings failed. You can still
                        try to reset the settings manually by following
                        these
                        <a @click="openLink('https://github.com/ebkr/r2modmanPlus/wiki/Error:-White-or-blank-game-select-screen-on-startup#corrupted-settings-on-update')">
                            instructions.
                        </a>
                    </p>

                    <p v-else-if="phase === PHASES.RETRY_FAILED">
                        Locally stored settings were reset, but that
                        didn't solve the issue with loading the
                        settings. If there's a newer version of the
                        manager available, try installing it.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import R2Error from "../model/errors/R2Error";
import Game from "..//model/game/Game";
import GameManager from "../model/game/GameManager";
import ManagerSettings from "../r2mm/manager/ManagerSettings";
import { SETTINGS_DB_NAME } from "../r2mm/manager/SettingsDexieStore";

enum PHASES {
    INITIAL = 0,
    LOADED = 1,
    // Only error states beyond this point.
    ERROR_STATES = 100,
    GAME_FAILED = 101,
    SETTINGS_FAILED = 102,
    RESET_FAILED = 103,
    RETRY_FAILED = 104
}

type SettingsLoaderType = {
    logError: (error: R2Error) => void;
    openLink: (url: string) => void;
}

const props = defineProps<SettingsLoaderType>();

const error = ref<R2Error|null>(null);
const phase = ref<PHASES>(PHASES.INITIAL);

function handleError(name: string, message: string) {
    error.value = new R2Error(name, message);
    props.logError(error.value);
}

async function loadSettings(game: Game) {
    const isRetry = phase.value === PHASES.SETTINGS_FAILED;
    let settings;
    let error;

    try {
        settings = await ManagerSettings.getSingleton(game);
    } catch (e) {
        handleError("Failed to read ManagerSettings", `${e}`);
        phase.value = isRetry ? PHASES.RETRY_FAILED : PHASES.SETTINGS_FAILED;
        return;
    }

    try {
        // Force reload settings from Dexie just to be sure although
        // .getSingleton() should have done it already.
        error = await settings.load(true);
    } catch (e) {
        handleError("Failed to load ManagerSettings", `${e}`);
        phase.value = isRetry ? PHASES.RETRY_FAILED : PHASES.SETTINGS_FAILED;
        return;
    }

    if (error) {
        handleError(error.name, error.message);
        phase.value = isRetry ? PHASES.RETRY_FAILED : PHASES.SETTINGS_FAILED;
        return;
    }

    phase.value = PHASES.LOADED;
}

async function resetSettings() {
    try {
        await resetIndexedDB();
    } catch (e) {
        handleError("Failed to reset IndexedDB", `${e}`);
        phase.value = PHASES.RESET_FAILED;
        return;
    }

    try {
        // Discard settings singleton since it might be in invalid
        // state after the earlier failed loading attempt.
        ManagerSettings.discardSingleton();

        // We know by now that getDefaultGame is safe to use.
        await loadSettings(getDefaultGame());
    } catch (e) {
        handleError("Unexpected ManagerSettings error", `${e}`);
        phase.value = PHASES.RETRY_FAILED;
    }
}

function resetIndexedDB() {
    const DBDeleteRequest = window.indexedDB.deleteDatabase(SETTINGS_DB_NAME);

    return new Promise<void>((resolve, reject) => {
        DBDeleteRequest.onsuccess = () => resolve();
        DBDeleteRequest.onerror = () => reject("Deleting settings database failed");
    });
}

onMounted(async () => {
    let defaultGame;

    try {
        defaultGame = getDefaultGame();
    } catch (e) {
        handleError("Failed to read game definitions", `${e}`);
        phase.value = PHASES.GAME_FAILED;
        return;
    }

    try {
        await loadSettings(defaultGame);
    } catch (e) {
        handleError("Unexpected ManagerSettings error", `${e}`);
        phase.value = PHASES.SETTINGS_FAILED;
    }
});

function getDefaultGame() {
    // Don't trust the non-null asserted typing of GameManager.defaultGame.
    if (GameManager.defaultGame === undefined) {
        throw new Error("GameManager.defaultGame returned undefined");
    }

    return GameManager.defaultGame;
};

</script>
