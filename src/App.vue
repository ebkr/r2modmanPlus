<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import ProfileProvider from './providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from './r2mm/model_implementation/ProfileImpl';
import LogOutput from './r2mm/data/LogOutput';
import LogOutputProvider from './providers/ror2/data/LogOutputProvider';

ProfileProvider.provide(() => new ProfileImpl());
LogOutputProvider.provide(() => LogOutput.getSingleton())

@Component
export default class App extends Vue {

    created() {
        this.$watch('$q.dark.isActive', () => {
            document.documentElement.classList.toggle('html--dark', this.$q.dark.isActive);
        });
    }

}
</script>
