<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as fs from 'fs-extra';
import { ipcRenderer } from 'electron';
// import 'src/css/superhero.bulma.css';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import { isNull } from 'util';

import * as path from 'path';

@Component
export default class App extends Vue {

    created() {
        this.$watch('$q.dark.isActive', () => {
            document.documentElement.classList.toggle('html--dark', this.$q.dark.isActive);
        });
    }

}
</script>
