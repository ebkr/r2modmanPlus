<template>
    <div>
        <Hero
            :title="configFile.getName()"
            subtitle="Editing config file"
            hero-type="primary"
        />
        <div class="margin-top"></div>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <ConfigEntryEditor :config-file="configFile" v-if="isEntryEditor"/>
        <ConfigRawEditor v-else/>
    </div>
</template>

<script setup lang="ts">
import {Hero} from "../../all";
import ConfigFile from "../../../model/file/ConfigFile";
import {computed} from "vue";
import ConfigEntryEditor from "components/config-components/v2/ConfigEntryEditor.vue";
import ConfigRawEditor from "components/config-components/v2/ConfigRawEditor.vue";

export type ConfigEditLayoutProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEditLayoutProps>();

const isEntryEditor = computed(() => {
    if (props.configFile && props.configFile.getName()) {
        console.log("Config file:", props.configFile);
        return props.configFile.getName().endsWith(".cfg")
    }
    return false;
});
</script>
