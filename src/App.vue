<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'bulma/css/bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import 'bulma-divider/dist/css/bulma-divider.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';


@Component
export default class App extends Vue {} 
</script>