<template>
  <div>
    <hero :title=heroTitle :subtitle=loadingText :heroType=heroType />
    <div class="container">
        About
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Hero } from '../components/all';

@Component({
    components: {
        'hero': Hero,
    }
})
export default class About extends Vue {}
</script>
