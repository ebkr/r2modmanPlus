<template>
    <div>
        <Hero
            v-if="configFile"
            :title="configFile.getName()"
            subtitle="Editing config file"
            hero-type="primary"
        />
        <div class="margin-top"></div>
        <ConfigEntryEditor :config-file="configFile" v-if="isEntryEditor" @changed="() => emits('changed')"/>
        <ConfigRawEditor v-else/>
    </div>
</template>

<script setup lang="ts">
import {Hero} from "../../all";
import ConfigFile from "../../../model/file/ConfigFile";
import {computed} from "vue";
import ConfigEntryEditor from "./ConfigEntryEditor.vue";
import ConfigRawEditor from "./ConfigRawEditor.vue";

export type ConfigEditLayoutProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEditLayoutProps>();
const emits = defineEmits<{
    (e: 'changed'): void;
}>();

const isEntryEditor = computed(() => {
    if (props.configFile && props.configFile.getName()) {
        console.log("Config file:", props.configFile);
        return props.configFile.getName().endsWith(".cfg")
    }
    return false;
});
</script>
