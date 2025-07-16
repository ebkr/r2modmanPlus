<script lang="ts" setup>
import InteractionProvider from "src/providers/ror2/system/InteractionProvider";
import { ref } from "vue";

export type CopyToClipboardButtonProps = {
    copyValue: string;
}

const props = defineProps<CopyToClipboardButtonProps>();

const showLoading = ref(false);

function copy() {
    InteractionProvider.instance.copyToClipboard(props.copyValue);
    showLoading.value = true;
    setTimeout(() => {
        showLoading.value = false;
    }, 500);
}

</script>

<template>
    <button class="button" @click="copy" v-if="!showLoading">
        <i class="fas fa-clipboard"></i>
        <span class="margin-left--half-width smaller-font">
            <slot></slot>
        </span>
    </button>
    <button @click.prevent class="button is-loading" v-else>
        <slot></slot>
    </button>
</template>
