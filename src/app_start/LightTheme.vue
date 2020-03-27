<template>
  <router-view />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'bulma/css/bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/js/bulma-steps.min.js';
import 'bulma-divider/dist/css/bulma-divider.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import ThemeManager from '../r2mm/manager/ThemeManager';
import { isNull, isUndefined } from 'util';

let darkThemeNode: any = undefined;

@Component
export default class LightTheme extends Vue {
    created() {
        ThemeManager.apply();
    }
}
</script>