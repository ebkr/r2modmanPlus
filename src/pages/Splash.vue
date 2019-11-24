<template>
  <hero :title=heroTitle :subtitle=loadingText :heroType=heroType />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Hero from '../components/Hero.vue';

@Component({
    components: {
        'hero': Hero
    }
})
export default class Splash extends Vue {
    heroTitle: string = 'r2modman'
    loadingText: string = 'Initialising';
    heroType: string = "is-info";

    constructor() {
      super();
    }

    private checkForUpdates() {
      this.loadingText = "Checking for updates";
      setTimeout(()=>{
        this.getThunderstoreMods();
      }, 2000)
    }

    private getThunderstoreMods() {
      this.loadingText = "Getting mod list from Thunderstore";
    }

    created() {
      this.checkForUpdates();
    }
}
</script>
