<template>
    <div id="q-app">
        <SettingsLoader :logError="logError" :openLink="openLink">
            <App />
        </SettingsLoader>
    </div>
</template>

<script lang="ts" setup>
import App from "./App.vue";
import SettingsLoader from "./components/SettingsLoader.vue";
import R2Error from "./model/errors/R2Error";
import LinkProvider from './providers/components/LinkProvider';

function logError(error: R2Error) {
    console.error(error.name, error.message, error.stack);
}

function openLink(url: string) {
    LinkProvider.instance.openLink(url);
}
</script>
