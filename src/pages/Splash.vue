<template>
  <div>
    <hero :title=heroTitle :subtitle='loadingText' :heroType=heroType />
    <div class="notification is-warning">
        <p>A new version of Risk of Rain 2 has been released. Many mods may be broken.</p>
    </div>
    <progress-bar />
    <div class="columns">
      <div class="column is-one-quarter">
        <aside class="menu">
          <p class="menu-label">Help</p>
          <ul class="menu-list">
            <li><a @click="view = 'about'" :class="[view === 'about' ? 'is-active' : '']">About</a></li>
            <li><a @click="view = 'faq'" :class="[view === 'faq' ? 'is-active' : '']">FAQ</a></li>
            <li><a href="https://github.com/ebkr/r2modmanPlus" target="_blank"><i class="fab fa-github fa-lg" aria-hidden="true"/></a></li>
          </ul>
        </aside>
      </div>
      <div class="column is-three-quarters">
        <div>
          <br/>
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="container" v-if="view !== 'main'">
                    <i class="fas fa-long-arrow-alt-left margin-right"/>
                    <strong><a @click="view = 'main'">Go back</a></strong>
                    <br/><br/>
                </div>
                <div class="container" v-if="view === 'main'">
                  <p>
                    <span class="icon">
                      <i class="fas fa-info-circle"/>
                    </span>
                    &nbsp;
                    <strong>Did you know?</strong>
                  </p>
                  <p>
                    You can associate the "Install with Mod Manager" button on <a href="https://thunderstore.io" target="_blank">Thunderstore</a> with R2MM. <br/>
                    Just go to settings and click "Associate Install with Mod Manager button".
                  </p>
                </div>
                <div class="container" v-else-if="view === 'about'">
                  <p>
                    <span class="icon">
                      <i class="fas fa-address-card"/>
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
                <div class="container" v-else-if="view === 'faq'">
                  <p>
                    <span class="icon">
                      <i class="fas fa-question-circle"/>
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
import { Hero, Progress } from '../components/all';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
    }
})
export default class Splash extends Vue {
    heroTitle: string = 'Starting r2modman';
    loadingText: string = 'Initialising';
    heroType: string = 'is-info';
    view: string = 'main';

    constructor() {
      super();
    }

    private checkForUpdates() {
      this.loadingText = 'Checking for updates';
      setTimeout(()=>{
        this.getThunderstoreMods();
      }, 2000)
    }

    private getThunderstoreMods() {
      this.loadingText = 'Getting mod list from Thunderstore';
    }

    created() {
        this.checkForUpdates();
    }
}
</script>
