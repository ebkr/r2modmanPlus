<template>
  <div id="q-app">
    <template v-if="darkTheme">
        <DarkTheme/>
    </template>
    <template v-else>
        <LightTheme/>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LightTheme from './app_start/LightTheme.vue';
import DarkTheme from './app_start/DarkTheme.vue';

@Component({
    components: {LightTheme, DarkTheme}
})
export default class App extends Vue {

    darkTheme: boolean = false;

} 
</script>