<template>
    <div id="config-entry-wrapper">
        <div id="config-entry-actions">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div id="config-entry-main" v-if="configurationFile">
            <div id="config-entry-sections">
                <h3 class='subtitle is-3'>Sections</h3>
                <ul>
                    <template v-for="(section, sectionIndex) in configurationFile.sections" :key="`li-section-${sectionIndex}-${section.sectionName}`">
                        <li v-if="section.sectionName.length > 0">
                            <a :href="`#${sectionIndex}`">{{ section.sectionName }}</a>
                        </li>
                    </template>
                </ul>
                <hr/>
            </div>
            <div id="config-entries">
                <div class="outer-row margin-top margin-right" v-for="(section, sectionIndex) of configurationFile.sections">
                    <div class="section-title" :id="sectionIndex.toString()">
                        <p class="title is-6" @click="() => toggleSectionVisibility(section)">{{ section.sectionName }}</p>
                        <p v-if="collapsedSections.includes(section)" class="smaller-font">({{ section.entries.length }} hidden)</p>
                    </div>
                    <div class="section-content">
                        <template v-for="(entry, entryIndex) of section.entries" :key="`entry-${entryIndex}-${section.sectionName}`">
                            <div class="inner-row" v-if="!collapsedSections.includes(section)">
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
                                            <template v-if="!getSelectOptions(entry).includes(entry.value)">
                                                <option :value="entry.value">
                                                    {{ entry.value }}
                                                </option>
                                            </template>
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
                        </template>
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
                    ...value,
                    displayValue: value.displayValue.length > 200
                        ? value.displayValue.substring(0, 200) + "..."
                        : value.displayValue,
                };
            });
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

#config-entry-wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: min-content 1fr;
    overflow-y: hidden;
}

#config-entry-main {
    height: 100%;
    overflow-y: auto;
    width: 100%;
    display: grid;
    grid-template-rows: min-content 1fr;
}

#config-entries {
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-gap: 1rem;
    height: 100%;
}

.outer-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    height: 100%;
    border-bottom: 1px solid var(--v2-table-row-border-color);
}

.section-title {
    position: sticky;
    top: 1rem;
    height: min-content;
    padding-bottom: 2rem;
}

.inner-row {
    padding-bottom: 2rem;
}

.title {
    margin-bottom: 0;
}

#config-entry-actions {
    text-align: right;
    width: 100%;
    padding-right: 2rem;
}
</style>
