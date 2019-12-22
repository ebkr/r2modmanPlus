<template>
  <div>
    <hero title='Profile selection' subtitle='Profiles help to organise mods easier' heroType='is-info' />
    <div class='columns'>
      <div class='column is-full'>
        <div>
          <br/>
          <article class='media'>
            <div class='media-content'>
              <div class='content'>
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
export default class Profiles extends Vue {
    
}
</script>
