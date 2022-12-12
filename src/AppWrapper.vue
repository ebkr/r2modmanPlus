<template>
    <div id="q-app">
        <SettingsLoader :logError="logError">
            <App />
        </SettingsLoader>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import App from "./App.vue";
import SettingsLoader from "./components/SettingsLoader.vue";
import R2Error from "./model/errors/R2Error";

@Component({
    components: {App, SettingsLoader}
})
export default class AppWrapper extends Vue {
    logError(error: R2Error) {
        console.error(error.name, error.message, error.stack);
    }
}
</script>
