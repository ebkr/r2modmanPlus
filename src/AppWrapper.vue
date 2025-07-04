<template>
    <SettingsLoader :logError="logError" :openLink="openLink">
        <App />
    </SettingsLoader>
</template>

<script lang="ts" setup>
import App from "./App.vue";
import SettingsLoader from "./components/SettingsLoader.vue";
import R2Error from "./model/errors/R2Error";
import LinkProvider from './providers/components/LinkProvider';
import { providePathImplementation } from './providers/node/path/path';
import { NodePathImplementation } from './providers/node/path/NodePathImplementation';
import { provideChildProcessImplementation } from './providers/node/child_process/child_process';
import { NodeChildProcessImplementation } from './providers/node/child_process/ChildProcessImplementation';
import {provideOsImplementation} from "./providers/node/os/os";
import {NodeOsImplementation} from "./providers/node/os/NodeOsImplementation";

providePathImplementation(() => NodePathImplementation);
provideChildProcessImplementation(() => NodeChildProcessImplementation);
provideOsImplementation(() => NodeOsImplementation);

function logError(error: R2Error) {
    console.error(error.name, error.message, error.stack);
}

function openLink(url: string) {
    LinkProvider.instance.openLink(url);
}
</script>
