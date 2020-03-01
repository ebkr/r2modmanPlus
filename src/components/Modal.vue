<template>
  <div :class="['modal', {'is-active':open}]">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-content">
      <div class="card">
        <header class="card-header">
          <slot name="title"></slot>
        </header>
        <div class="card-content">
          <slot name="body"></slot>
        </div>
        <div class="card-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {

    open: boolean = true;

    closeModal() {
        this.$emit('close-modal');
    }


}
</script>