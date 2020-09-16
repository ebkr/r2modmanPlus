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
        <div class='container'>
          <br/>
          <nav class='level' v-if="isOffline">
            <div class='level-item'>
              <a class='button is-info' @click="continueOffline()">Continue offline</a>&nbsp;
              <a class='button' @click="retryConnection()">Try to reconnect</a>
            </div>
            <br/><br/>
          </nav>
        </div>
        <div>
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
                  <ul class='margin-right'>
                    <li>
                      <p>
                        You can use the "Install with Mod Manager" button on <link-component
                              :url="'https://thunderstore.io'" :target="'external'">Thunderstore</link-component>
                        with r2modman.
                      </p>
                    </li>
                    <li>
                      <p>
                        You can export the selected profile from the settings screen as either a file, or a code.
                        This makes it easy to share your mod list with friends!
                      </p>
                    </li>
                  </ul>
                  <p>
                    <span class='icon'>
                      <i class='fas fa-question-circle'/>
                    </span>
                    &nbsp;
                    <strong>Having trouble?</strong>
                  </p>
                  <p>
                    Send a screenshot of the error in the Thunderstore modding discord server. Feel free to ping me
                    if it doesn't get resolved.
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
                  <p>It's created by Ebkr, using Quasar.</p>
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
                    <li>
                      <strong><p>Starting the game with mods</p></strong>
                      <p>
                        You have to start the game from within the manager. Starting through Steam will not work
                        without taking manual steps.
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
import { Logger, LogSeverity } from '../r2mm/logging/Logger';
import FolderMigration from '../migrations/FolderMigration';

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
        new RequestItem('ExclusionsList', 0)
    ];
    isOffline: boolean = false;

    exclusionMap: Map<string, boolean> = new Map();

    // Used to produce a single, combined, RequestItem./
    private reduceRequests(): RequestItem {
        return this.requests.reduce((x, y) => x.merge(y));
    }

    // Ensure that r2modman isn't outdated.
    private checkForUpdates() {
        this.loadingText = 'Preparing';
        ipcRenderer.once('update-done', ()=>{
            this.getRequestItem('UpdateCheck').setProgress(100);
            this.getExclusions();
        });
        ipcRenderer.send('update-app');
    }

    private getExclusions() {
        this.loadingText = 'Connecting to GitHub repository';
        axios.get('https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md', {
            onDownloadProgress: progress => {
                this.loadingText = 'Downloading exclusions'
                this.getRequestItem('ExclusionsList').setProgress((progress.loaded / progress.total) * 100);
            }
        }).then(response => {
            this.getRequestItem('ExclusionsList').setProgress(100);
            response.data.split('\n').forEach((exclude: string) => {
                this.exclusionMap.set(exclude, true);
            });
            ThunderstorePackages.EXCLUSIONS = this.exclusionMap;
        }).finally(() => {
            this.getThunderstoreMods(0);
        })
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
            // Temporary. Creates a new standard profile until Profiles section is completed
            new Profile('Default');
            ThunderstorePackages.handlePackageApiResponse(response);
            this.$store.dispatch("updateThunderstoreModList", ThunderstorePackages.PACKAGES);
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

  retryConnection() {
    this.$router.go(0);
  }

    continueOffline() {
        ThunderstorePackages.PACKAGES = [];
        this.$router.push({path: '/profiles'});
    }

    async created() {
        ipcRenderer.once('receive-appData-directory', (_sender: any, appData: string) => {
            PathResolver.APPDATA_DIR = path.join(appData, 'r2modmanPlus-local');
            fs.ensureDirSync(PathResolver.APPDATA_DIR);
            ThemeManager.apply();
            Logger.Log(LogSeverity.INFO, `Starting manager on version ${ManagerInformation.VERSION.toString()}`);
            ipcRenderer.once('receive-is-portable', (_sender: any, isPortable: boolean) => {
                ManagerInformation.IS_PORTABLE = isPortable;
                // TODO: Re-enable folder migration
                // this.loadingText = 'Migrating mods (this may take a while)';
                // setTimeout(() => {
                //     FolderMigration.checkAndMigrate()
                //         .then(this.checkForUpdates);
                // }, 100);
                this.loadingText = 'Checking for updates';
                setTimeout(this.checkForUpdates, 100);
            });
            ipcRenderer.send('get-is-portable');
        });
        ipcRenderer.send('get-appData-directory');
    }
}
</script>
