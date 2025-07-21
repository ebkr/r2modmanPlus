<template>
    <div class="container">
        <div id="config-overview" v-if="configurationFile">
            <h3 class='subtitle is-3'>Sections</h3>
            <ul>
                <li v-for="(section, sectionIndex) of configurationFile.sections" :key="`li-section-${sectionIndex}-${section.sectionName}`">
                    <a :href="`#${key}`">{{ section.sectionName }}</a>
                </li>
            </ul>
            <hr/>
            <div class="outer-row margin-top" v-for="(section, sectionIndex) of configurationFile.sections" :key="`section-${sectionIndex}-${section.sectionName}`">
                <p class="title is-6" :id="sectionIndex"><span class="sticky-top sticky-top--no-shadow sticky-top--no-padding" @click="() => toggleSectionVisibility(section)">
                    {{ section.sectionName }}
                    <br/>
                    <p v-if="collapsedSections.includes(section)" class="smaller-font">({{ section.entries.length }} hidden)</p>
                </span></p>
                <div>
                    <div class="inner-row" v-for="(entry, entryIndex) of section.entries" :key="`entry-${entryIndex}-${section.sectionName}`" v-if="!collapsedSections.includes(section)">
                        <div class="entry-info">
                            <p><strong>{{ entry.entryName }}</strong></p>
                            <div v-for="(comment, commentIndex) of entry.commentLines" :key="`description-comment-${commentIndex}-${section.sectionName}`">
                                <span v-if="comment.isDescription">{{ comment.displayValue }}</span>
                            </div>
                            <div v-for="(comment, commentIndex) of entry.commentLines" :key="`metadata-comment-${commentIndex}-${section.sectionName}`">
                                <span class="smaller-font metadata-text" v-if="!comment.isDescription">
                                    {{ comment.displayValue }}
                                </span>
                            </div>
                        </div>
                        <div class="settings-input-container">
                            <input type="text" class="input"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import ConfigFile from "../../../model/file/ConfigFile";
import { buildConfigurationFileFromPath, ConfigurationFile, ConfigurationSection } from 'src/utils/ConfigUtils';
import { reactive, ref } from 'vue';

export type ConfigEntryEditorProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEntryEditorProps>();
const configurationFile = ref<ConfigurationFile | null>(null);
const collapsedSections = reactive<ConfigurationSection[]>([]);

buildConfigurationFileFromPath(props.configFile)
    .then(value => configurationFile.value = value);

function toggleSectionVisibility(section: ConfigurationSection) {
    const collapsedSectionIndex = collapsedSections.indexOf(section);
    if (collapsedSectionIndex >= 0) {
        collapsedSections.splice(collapsedSectionIndex, 1);
    } else {
        collapsedSections.push(section);
    }
}

</script>

<style lang="scss" scoped>
#config-overview {
    width: 100%;

    .outer-row {
        display: grid;
        grid-template-columns: 200px auto;
        border-bottom: 1px solid var(--v2-table-row-border-color);
    }

    .inner-row {
        width: 100%;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--v2-table-row-border-color);
    }

    .entry-info {
        margin-bottom: 0.5rem;
    }
}

.metadata-text {
    color: var(--v2-secondary-text-color) !important;
}
</style>
