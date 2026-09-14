<template>
    <div id="config-edit-layout">
        <Hero
            v-if="configFile"
            :title="configFile.getName()"
            :subtitle="t('translations.pages.configEditor.editConfig.subtitle')"
            hero-type="primary"
        />
        <div class="margin-top"></div>
        <ConfigEntryEditor :config-file="configFile" v-if="isEntryEditor" @changed="() => emits('changed')"/>
        <ConfigRawEditor :file-path="configFile.getPath()" @changed="() => emits('changed')" v-else />
    </div>
</template>

<script setup lang="ts">
import {Hero} from "../all";
import ConfigFile from "../../model/file/ConfigFile";
import {computed} from "vue";
import ConfigEntryEditor from "./ConfigEntryEditor.vue";
import ConfigRawEditor from "./ConfigRawEditor.vue";
import { useI18n } from 'vue-i18n';

export type ConfigEditLayoutProps = {
    configFile: ConfigFile;
}

const { t, d, messages, locale } = useI18n();

const props = defineProps<ConfigEditLayoutProps>();
const emits = defineEmits<{
    (e: 'changed'): void;
}>();

const isEntryEditor = computed(() => {
    return props.configFile.getName().endsWith(".cfg")
});
</script>

<style lang="scss" scoped>
#config-edit-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
}
</style>
