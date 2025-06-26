<script lang="ts" setup>
import Timeout = NodeJS.Timeout;
import { onMounted, ref, onUnmounted } from 'vue';

type SettingsItemProps = {
    action?: string;
    description?: string;
    value?: () => Promise<any>;
    icon?: string;
}

const reactiveValue = ref<any | null>(null);
const timeout = ref<Timeout | null>(null);

const props = withDefaults(defineProps<SettingsItemProps>(), {
    action: '',
    description: '',
    icon: '',
    value: Promise.resolve
});

const emits = defineEmits<{
    (e: 'click'): void;
}>();

onMounted(async () => {
    if (timeout.value !== null) {
        clearInterval(timeout.value);
    }
    props.value().then(value => reactiveValue.value = value);
    timeout.value = setInterval(() => {
        props.value().then(value => reactiveValue.value = value);
    }, 1000);
});

onUnmounted(() => {
    if (timeout.value !== null) {
        clearInterval(timeout.value);
        timeout.value = null;
    }
})

function emitClick() {
    emits('click');
    setTimeout(() => {
        props.value().then(value => reactiveValue.value = value);
    }, 20);
}

</script>

<template>
    <a class="panel-block is-block settings-panel" @click="emitClick()">
        <span class="icon is-pulled-right">
            <i :class="['fas', icon]" aria-hidden="true"></i>
        </span>
        <div class="settings-panel__content">
            <p class="title is-6 is-marginless">{{action}}</p>
            <p class="subtitle is-italic is-bold is-6 is-marginless">{{description}}</p>
            <p class="subtitle is-6 text-grey" v-if="reactiveValue !== null">{{reactiveValue}}</p>
        </div>
    </a>
</template>
