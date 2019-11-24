<template>
  <div>
    <hero :title=heroTitle :subtitle=loadingText :heroType=heroType />
    <div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image is-32x32">
            
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <div class="container">
              <p>
                <span class="icon">
                  <i class="fas fa-info-circle" />
                </span>
                &nbsp;
                <strong>Did you know?</strong>
              </p>
              <p>
                You can associate the "Install with Mod Manager" button on <a href="https://thunderstore.io" target="_blank">Thunderstore</a> with R2MM. <br/>
                Just go to settings and click "Associate Install with Mod Manager button".
              </p>
              <progress-bar />
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import Hero from '../components/Hero.vue';
import Progress from '../components/Progress.vue';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
    }
})
export default class Splash extends Vue {
    heroTitle: string = 'r2modman';
    loadingText: string = 'Initialising';
    heroType: string = 'is-info';

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
