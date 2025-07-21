<template>
    <div>
        <div v-for="(value, index) of configurationFile.sections" :key="`section-${index}`">
            {{ value.sectionName }}
        </div>
    </div>
</template>

<script lang="ts" setup>

import ConfigFile from "../../../model/file/ConfigFile";
import {buildConfigurationFileFromPath, ConfigurationFile} from "src/utils/ConfigUtils";
import {ref} from "vue";

export type ConfigEntryEditorProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEntryEditorProps>();
const configurationFile = ref<ConfigurationFile | null>(null);

buildConfigurationFileFromPath(props.configFile)
    .then(value => {
        console.log(value);
        configurationFile.value = value
    });

</script>
