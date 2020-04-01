<template>
  <div>
    <hero :title=heroTitle :subtitle='loadingText' :heroType=heroType />
    <div class='notification is-warning'>
        <p>Risk of Rain 2 updates may break mods. If a new update has been released, please be patient.</p>
    </div>
    <progress-bar 
        :max='requests.length * 100' 
        :value='reduceRequests().getProgress() > 0 ? reduceRequests().getProgress() : undefined'
        :className='[reduceRequests().getProgress() > 0 ? "is-info" : ""]' />
    <br/>
    <nav class='level' v-if="isOffline">
        <div class='level-item'>
            <a class='button is-info' @click="continueOffline()">Continue in offline mode</a>
        </div>
    </nav>
    <br/>
    <div class='columns'>
      <div class='column is-one-quarter'>
        <aside class='menu'>
          <p class='menu-label'>Help</p>
          <ul class='menu-list'>
            <li><a @click="view = 'about'" :class="[view === 'about' ? 'is-active' : '']">About</a></li>
            <li><a @click="view = 'faq'" :class="[view === 'faq' ? 'is-active' : '']">FAQ</a></li>
            <li>
              <link-component :url="'https://github.com/ebkr/r2modmanPlus'" :target="'external'">
                <i class="fab fa-github fa-lg" aria-hidden="true"/>
              </link-component>
            </li>
          </ul>
        </aside>
      </div>
      <div class='column is-three-quarters'>
        <div>
          <br/>
          <article class='media'>
            <div class='media-content'>
              <div class='content'>
                <div class='container' v-if="view !== 'main'">
                    <i class='fas fa-long-arrow-alt-left margin-right'/>
                    <strong><a @click="view = 'main'">Go back</a></strong>
                    <br/><br/>
                </div>
                <div class='container' v-if="view === 'main'">
                  <p>
                    <span class='icon'>
                      <i class='fas fa-info-circle'/>
                    </span>
                    &nbsp;
                    <strong>Did you know?</strong>
                  </p>
                  <p>
                    You can use the "Install with Mod Manager" button on <link-component :url="'https://thunderstore.io'" :target="'external'">Thunderstore</link-component> with R2MM. <br/>
                    If you have multiple installations, simply launch the one you want to associate with Thunderstore first!
                  </p>
                </div>
                <div class='container' v-else-if="view === 'about'">
                  <p>
                    <span class='icon'>
                      <i class='fas fa-address-card'/>
                    </span>
                    &nbsp;
                    <strong>About r2modman</strong>
                  </p>
                  <p>It's created by ebkr, using Quasar.</p>
                  <p>Quasar provides the following development tools that r2modman is built upon:</p>
                  <ul>
                      <li>Electron</li>
                      <li>Node</li>
                      <li>Vue</li>
                      <li>TypeScript</li>
                  </ul>
                </div>
                <div class='container' v-else-if="view === 'faq'">
                  <p>
                    <span class='icon'>
                      <i class='fas fa-question-circle'/>
                    </span>
                    &nbsp;
                    <strong>FAQ</strong>
                  </p>
                  <ul>
                      <li>
                          <strong><p>How do I get started?</p></strong>
                          <p>
                              Head on over to the online tab, and download BepInEx and R2API.
                          </p>
                      </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero, Progress, Link } from '../components/all';

import RequestItem from '../model/requests/RequestItem';
import axios from 'axios';
import ThunderstoreMod from '../model/ThunderstoreMod';
import Profile from '../model/Profile';

import ThunderstorePackages from 'src/r2mm/data/ThunderstorePackages'
import { ipcRenderer } from 'electron';
import PathResolver from '../r2mm/manager/PathResolver';
import ManagerInformation from '../_managerinf/ManagerInformation';

import * as path from 'path';
import * as fs from 'fs-extra';
import ThemeManager from '../r2mm/manager/ThemeManager';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
        'link-component': Link,
    }
})
export default class Splash extends Vue {
    heroTitle: string = 'Starting r2modman';
    loadingText: string = 'Initialising';
    heroType: string = 'is-info';
    view: string = 'main';
    requests = [
        new RequestItem('UpdateCheck', 0),
        new RequestItem('ThunderstoreDownload', 0),
    ];
    isOffline: boolean = false;

    // Used to produce a single, combined, RequestItem./
    private reduceRequests(): RequestItem {
        return this.requests.reduce((x, y) => x.merge(y));
    }

    // Ensure that r2modman isn't outdated.
    private checkForUpdates() {
        this.loadingText = 'Preparing';
        ipcRenderer.once('update-done', ()=>{
            this.getRequestItem('UpdateCheck').setProgress(100);
            this.getThunderstoreMods(0);
        });
        ipcRenderer.send('update-app');
    }

    // Provide access to a request item, as item is not stored in a map.
    private getRequestItem(name: string): RequestItem {
        return this.requests.filter(ri => ri.getName() === name)[0];
    }

    // Get the list of Thunderstore mods via /api/v1/package.
    private getThunderstoreMods(attempt: number) {
        this.loadingText = 'Connecting to Thunderstore';
        axios.get('https://thunderstore.io/api/v1/package', {
            onDownloadProgress: progress => {
                this.loadingText = 'Getting mod list from Thunderstore'
                this.getRequestItem('ThunderstoreDownload').setProgress((progress.loaded / progress.total) * 100);
            }
        }).then(response => {
            let tsMods: ThunderstoreMod[] = [];
            response.data.forEach((mod: any) => {
                let tsMod = new ThunderstoreMod();
                tsMods.push(tsMod.parseFromThunderstoreData(mod));
            })
            // Temporary. Creates a new standard profile until Profiles section is completed
            new Profile('Default');
            ThunderstorePackages.PACKAGES = tsMods;
            this.$router.push({path: '/profiles'});
        }).catch((e_)=>{
            this.isOffline = true;
            if (attempt < 5) {
                this.getThunderstoreMods(attempt + 1);
            } else {
                this.heroTitle = 'Failed to get mods from Thunderstore';
                this.loadingText = 'You may be offline, however you may still use R2MM offline.';
            }
        })
    }

    continueOffline() {
        ThunderstorePackages.PACKAGES = [];
        this.$router.push({path: '/profiles'});
    }

    created() {
        ipcRenderer.once('receive-appData-directory', (_sender: any, appData: string) => {
            PathResolver.ROOT = path.join(appData, 'r2modmanPlus-local');
            fs.ensureDirSync(PathResolver.ROOT);
            ThemeManager.apply();
            ipcRenderer.once('receive-is-portable', (_sender: any, isPortable: boolean) => {
                // ManagerInformation.IS_PORTABLE = isPortable;
                ManagerInformation.IS_PORTABLE = true;
                this.checkForUpdates();
            });
            ipcRenderer.send('get-is-portable');
        });
        ipcRenderer.send('get-appData-directory');
    }
}
</script>
