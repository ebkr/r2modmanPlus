<script lang="ts" setup>
import R2Error from '../../model/errors/R2Error';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, ComputedRef } from 'vue';

const store = getStore<State>();

const error: ComputedRef<R2Error | null> = computed(() => store.state.error.error);
const name = computed(() => error.value ? error.value.name : '');
const message = computed(() => error.value ? error.value.message : '');
const solution = computed(() => error.value ? error.value.solution : '');

function close() {
    store.commit('error/discardError');
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
                <div class="mt-3 text-right" v-if="error.actions">
                    <button 
                        v-for="action in error.actions"
                        class="button is-white ml-3"
                        @click="action.function(); if(action.closeModal) close()"
                    >
                        {{action.label}}
                    </button>
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
