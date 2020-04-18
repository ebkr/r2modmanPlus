<template>
    <div id="q-app">
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import fs from 'fs-extra';
import { ipcRenderer } from 'electron';
import 'bulma/css/bulma.css';
// import 'src/css/superhero.bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import 'bulma-divider/dist/css/bulma-divider.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import { isNull } from 'util';

import * as path from 'path';

@Component
export default class App extends Vue {

    created() {
        ipcRenderer.once('receive-assets-path', (_sender: any, dir: string) => {
            const node = document.getElementById('darkThemeStyle');
            if (isNull(node)) {
                const darkThemeStyle = fs.readFileSync(path.join(dir, 'superhero.bulma.css')).toString();
                const node = document.createElement('style') as HTMLStyleElement;
                node.setAttribute('id', 'darkThemeStyle');
                node.innerText = darkThemeStyle;
                document.head.appendChild(node);
            }
        })
        ipcRenderer.send('get-assets-path');
    }

} 
</script>