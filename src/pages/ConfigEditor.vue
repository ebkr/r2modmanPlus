<template>
    <div id="config-editor">
        <ConfigSelectionLayout v-show="editing === null" @edit="bindEdit($event)"/>
<!--        <ConfigEditLayout-->
<!--            :config-file="editing"-->
<!--            @changed="editing = null"-->
<!--            v-if="editing !== null"/>-->
        <ConfigEditLayout :config-file="editing" @changed="editing = null"/>
    </div>
</template>

<script lang="ts" setup>

import ConfigSelectionLayout from '../components/config-components/ConfigSelectionLayout.vue';
import ConfigFile from '../model/file/ConfigFile';
import ConfigEditLayout from '../components/config-components/v2/ConfigEditLayout.v2.vue';
import { ref } from 'vue';

const editing = ref<ConfigFile | null>(null);

function bindEdit(editValue: ConfigFile | null) {
    editing.value = editValue;
}

</script>

<style lang="scss" scoped>
#config-editor {
    width: 100%;
}
</style>
