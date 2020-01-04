<template>
  <div>
    <hero :title=heroTitle :subtitle='loadingText' :heroType=heroType />
    <div class='notification is-warning'>
        <p>A new version of Risk of Rain 2 has been released. Many mods may be broken.</p>
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
                    You can associate the "Install with Mod Manager" button on <link-component :url="'https://thunderstore.io'" :target="'external'">Thunderstore</link-component> with R2MM. <br/>
                    Just go to settings and click "Associate Install with Mod Manager button".
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

    constructor() {
        super();
    }

    // Used to produce a single, combined, RequestItem./
    private reduceRequests(): RequestItem {
        return this.requests.reduce((x, y) => x.merge(y));
    }

    // Ensure that r2modman isn't outdated.
    private checkForUpdates() {
        this.loadingText = 'Checking for updates';
        setTimeout(()=>{
            this.getRequestItem('UpdateCheck').setProgress(100);
            this.getThunderstoreMods(0);
        }, 2000)
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
        }).catch((e)=>{
            if (attempt < 5) {
                this.getThunderstoreMods(attempt + 1);
            } else {
                this.heroTitle = 'Failed to get mods from Thunderstore';
                this.loadingText = 'You may be offline, however you may still use R2MM offline.';
            }
        })
    }

    created() {
        this.checkForUpdates();
    }
}
</script>
