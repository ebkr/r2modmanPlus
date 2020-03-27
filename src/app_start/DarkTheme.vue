<template>
  <router-view />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'src/css/superhero.bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import 'bulma-divider/dist/css/bulma-divider.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';

@Component
export default class DarkTheme extends Vue {} 
</script>