<template>
    <div>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div class="container">
            <div id="config-overview" v-if="configurationFile">
                <h3 class='subtitle is-3'>Sections</h3>
                <ul>
                    <li v-for="(section, sectionIndex) of configurationFile.sections" :key="`li-section-${sectionIndex}-${section.sectionName}`" v-if="section.sectionName.length > 0">
                        <a :href="`#${sectionIndex}`">{{ section.sectionName }}</a>
                    </li>
                </ul>
                <hr/>
                <div class="outer-row margin-top margin-right" v-for="(section, sectionIndex) of configurationFile.sections">
                    <p class="title is-6" :id="sectionIndex"><span class="sticky-top sticky-top--no-shadow sticky-top--no-padding" @click="() => toggleSectionVisibility(section)">
                        {{ section.sectionName }}
                        <br/>
                        <p v-if="collapsedSections.includes(section)" class="smaller-font">({{ section.entries.length }} hidden)</p>
                    </span></p>
                    <div>
                        <div class="inner-row" v-for="(entry, entryIndex) of section.entries" :key="`entry-${entryIndex}-${section.sectionName}`" v-if="!collapsedSections.includes(section)">
                            <div class="entry-info">
                                <p><strong>{{ entry.entryName }}</strong></p>
                                <div v-for="(comment, commentIndex) of getAppropriateCommentLines(entry)" :key="`description-comment-${commentIndex}-${section.sectionName}`">
                                    <span v-if="comment.isDescription">{{ comment.displayValue }}</span>
                                </div>
                                <div v-for="(comment, commentIndex) of getAppropriateCommentLines(entry)" :key="`metadata-comment-${commentIndex}-${section.sectionName}`">
                                    <span class="smaller-font metadata-text" v-if="!comment.isDescription">
                                        {{ comment.displayValue }}
                                    </span>
                                </div>
                                <div v-if="isDisplayTooLong(entry) && entriesWithExpandedComments.includes(entry)">
                                    <a href="#" @click="() => toggleEntryExpansion(entry)">Show less</a>
                                </div>
                                <div v-else-if="isDisplayTooLong(entry)">
                                    <a href="#" @click="() => toggleEntryExpansion(entry)">Show more</a>
                                </div>
                            </div>
                            <template v-if="entry.displayType === 'single-select' || entry.displayType === 'boolean'">
                                <div class="settings-input-container">
                                    <select class="select select--full" v-model="entry.value">
                                        <option v-for="(opt, optIndex) in getSelectOptions(entry)" :value="opt">
                                            {{ opt }}
                                        </option>
                                    </select>
                                </div>
                            </template>
                            <template v-else>
                                <div class="settings-input-container">
                                    <input type="text" class="input" v-model="entry.value"/>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ConfigFile from "../../model/file/ConfigFile";
import {
    buildConfigurationFileFromPath, ConfigurationEntry,
    ConfigurationFile,
    ConfigurationSection,
    getSelectOptions, saveConfigurationFile
} from '../../utils/ConfigUtils';
import { ref } from 'vue';

export type ConfigEntryEditorProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEntryEditorProps>();
const emits = defineEmits<{
    (e: 'changed'): void
}>();

const configurationFile = ref<ConfigurationFile | null>(null);
const collapsedSections = ref<ConfigurationSection[]>([]);
const entriesWithExpandedComments = ref<ConfigurationEntry[]>([]);

buildConfigurationFileFromPath(props.configFile.getPath())
    .then(value => configurationFile.value = value);

function toggleSectionVisibility(section: ConfigurationSection) {
    const collapsedSectionIndex = collapsedSections.value.indexOf(section);
    if (collapsedSectionIndex >= 0) {
        collapsedSections.value.splice(collapsedSectionIndex, 1);
    } else {
        collapsedSections.value.push(section);
    }
}

function save() {
    saveConfigurationFile(configurationFile.value!);
    emits('changed');
}

function cancel() {
    emits('changed');
}

function isDisplayTooLong(entry: ConfigurationEntry): boolean {
    if (entry.commentLines.length > 5) {
        return true;
    }
    return entry.commentLines.findIndex(value => value.displayValue.length >= 200) >= 0;
}

function getAppropriateCommentLines(entry: ConfigurationEntry) {
    if (!entriesWithExpandedComments.value.includes(entry)) {
        const commentLines = [...entry.commentLines]
            .slice(0, 5)
            .map(value => {
                return {
                    ...value
                };
            });

        commentLines.forEach(value => value.displayValue = value.displayValue.substring(0, 200));
        return commentLines;
    }
    return entry.commentLines;
}

function toggleEntryExpansion(entry: ConfigurationEntry) {
    const entryIndex = entriesWithExpandedComments.value.indexOf(entry);
    if (entryIndex >= 0) {
        entriesWithExpandedComments.value.splice(entryIndex, 1);
    } else {
        entriesWithExpandedComments.value.push(entry);
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
