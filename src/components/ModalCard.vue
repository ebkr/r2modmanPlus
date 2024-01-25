<template>
    <div :class="['modal', {'is-active': isActive}]">
        <div class="modal-background" @click="closeModal()"/>
        <div class="modal-card py-4">
            <header class="modal-card-head">
                <slot name="header"/>
            </header>
            <section class="modal-card-body">
                <slot name="body"/>
            </section>
            <footer class="modal-card-foot">
                <slot name="footer"/>
            </footer>
        </div>
        <button v-if="canClose" class="modal-close is-large" aria-label="close" @click="closeModal()"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class ModalCard extends Vue {

    @Prop({default: false, type: Boolean})
    isActive!: boolean;

    @Prop({default: true, type: Boolean})
    canClose!: boolean;

    closeModal() {
        if (this.canClose) {
            this.$emit('close-modal');
        }
    }
}
</script>


<style scoped lang="scss">

</style>
