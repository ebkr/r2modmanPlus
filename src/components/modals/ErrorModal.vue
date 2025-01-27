<script setup lang="ts">
import { computed } from 'vue';
import useStore from '../../store';

const usedStore = useStore();

const error = computed(() => {
    return usedStore.state.error.error;
});

const stage = computed(() => {
    return usedStore.state.error.stage;
})

const name = computed(() => {
    return error.value ? error.value.name : '';
});

const message = computed(() => {
    return error.value ? error.value.message : '';
});

const solution = computed(() => {
    return error.value ? error.value.solution : '';
});

function close() {
    usedStore.commit('error/discardError');
}

function progressErrorStage(event: Event) {
    usedStore.commit('error/progressErrorStage');
    // Used to unfocus after clicking, otherwise next action appears highlighted.
    (event.target! as HTMLInputElement).blur();
}
</script>

<template>
    <div v-if="error !== null" id="errorModal" class="modal z-top is-active">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <div class="notification is-danger">
                <template v-if="stage === 'VIEW_ERROR'">
                    <h3 class="title">Error</h3>
                    <h5 class="title is-5">{{name}}</h5>
                    <p class="inset">{{message}}</p>
                    <div class="margin-top">
                        <template v-if="solution">
                            <button class="button" @click="progressErrorStage">View potential solution</button>
                        </template>
                        <template v-else>
                            <button class="button" @click="close">Close</button>
                        </template>
                    </div>
                </template>
                <template v-if="stage === 'VIEW_SUGGESTION'">
                    <h3 class="title">Potential solution</h3>
                    <p class="inset">{{solution}}</p>
                    <div class="margin-top">
                        <button class="button" @click="progressErrorStage">Close</button>
                    </div>
                </template>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="close"></button>
    </div>
</template>

<style scoped lang="scss">
    p + div {
        margin-top: 1.5rem;
    }

    .inset {
        border-left: 5px solid white;
        padding: 0.5rem 0.5rem 0.5rem 1.5rem;
    }
</style>
