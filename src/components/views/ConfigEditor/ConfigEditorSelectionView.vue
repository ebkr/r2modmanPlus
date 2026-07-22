<script lang="ts" setup>
import { useConfigSelectionComposable } from 'src/components/composables/ConfigSelectionComposable';
import ConfigEntryEditor from 'src/components/config-components/ConfigEntryEditor.vue';
import { PartialConfigurationFile, buildConfigurationFileFromPath, ConfigurationFile } from 'src/utils/ConfigUtils';
import { computed, ref } from 'vue';

const { partialConfigFiles, loadConfigFiles } = useConfigSelectionComposable();

loadConfigFiles();

const configFile = ref<ConfigurationFile | undefined>();
const selectedPath = ref<string>('');

const sections = computed(() => {
    if (!configFile.value) {
        return [];
    }
    return configFile.value.sections.map(x => x.sectionName);
})

async function loadSingleConfig(config: PartialConfigurationFile) {
    selectedPath.value = config.relative;
    configFile.value = await buildConfigurationFileFromPath(config.path);
}

async function jumpToSection(sectionName: string) {
    console.log(document.getElementById(`#section-${sectionName}`))
    const section = document.getElementById(`#section-${sectionName}`);
    section?.scrollIntoView();
}

</script>

<template>
    <aside class="menu">
        <ul class="menu-list">
            <li v-for="config in partialConfigFiles">
                <a href="#" class="tagged-link list-item" :class="[{'is-active': selectedPath === config.relative}]" :title="config.relative" @click="loadSingleConfig(config)">
                    <div class="tagged-link__content">{{ config.filename }}</div>
                    <template v-if="selectedPath === config.relative && sections.length > 0">
                        <ul>
                            <li v-for="section in sections">
                                <a @click.stop.prevent="jumpToSection(section)" href="#">{{ section }}</a>
                            </li>
                        </ul>
                    </template>
                </a>
            </li>
        </ul>
    </aside>
    <div id='config-content' class="margin-left">
        <ConfigEntryEditor v-if="configFile" :configuration-file="configFile"/>
    </div>
</template>

<style lang="scss" scoped>
#config-selection {
    display: flex;
    flex: 1;
    overflow-y: auto;
}

.menu-list {
    overflow-y: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    max-height: 100%;
    width: 100%;
    font-size: 0.9rem;
}

.hint {
    font-size: 0.75rem;
    color: var(--v2-secondary-text-color);
}

.list-item {
    display: block;
    max-width: 25rem;
    line-break: anywhere;
}

#config-content {
    display: flex;
    flex: 1;
    overflow-y: auto;
}
</style>
