<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import R2Error from "../../model/errors/R2Error";

@Component
export default class ErrorModal extends Vue {
    get error(): R2Error | null {
        return this.$store.state.error.error;
    }

    get name() {
        return this.error ? this.error.name : '';
    }

    get message() {
        return this.error ? this.error.message : '';
    }

    get solution() {
        return this.error ? this.error.solution : '';
    }

    close() {
        this.$store.commit('error/discardError');
    }
}
</script>

<template>
    <div v-if="error !== null" id="errorModal" class="modal z-top is-active">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class="notification is-danger">
                <h3 class="title">Error</h3>
                <h5 class="title is-5">{{name}}</h5>
                <p>{{message}}</p>
                <div v-if="solution">
                    <h5 class="title is-5">Suggestion</h5>
                    <p>{{solution}}</p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="close"></button>
    </div>
</template>

<style scoped lang="scss">
    p + div {
        margin-top: 1.5rem;
    }
</style>
