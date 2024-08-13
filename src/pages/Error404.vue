<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">{{ $t(`pages.error.nothing`) }}<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Error404 extends Vue {}
</script>
