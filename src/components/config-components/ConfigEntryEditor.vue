<template>
    <div id="config-entry-wrapper">
        <div id="config-entry-actions">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div id="config-entry-main" v-if="configurationFile">
            <div id="config-entries">
                <div class="margin-right" :id="`#section-${section.sectionName}`" v-for="(section, sectionIndex) of configurationFile.sections">
                    <h2 class="title is-5 section-title">{{ section.sectionName}}</h2>
                    <div class="section-content">
                        <template v-for="(entry, entryIndex) of section.entries" :key="`entry-${entryIndex}-${section.sectionName}`">
                            <div class="inner-row" v-if="!collapsedSections.includes(section)">
                                <div class="entry-info">
                                    <p><strong>{{ entry.entryName }}</strong></p>
                                    <div v-for="(comment, commentIndex) of getAppropriateCommentLines(entry)" :key="`description-comment-${commentIndex}-${section.sectionName}`">
                                        <span v-if="comment.isDescription">{{ comment.displayValue }}</span>
                                    </div>
                                    <div v-for="(comment, commentIndex) of getAppropriateCommentLines(entry)" :key="`metadata-comment-${commentIndex}-${section.sectionName}`" class="metadata-container">
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
                                <template v-if="entry.displayType === 'single-select'">
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
                                <template v-else-if="entry.displayType === 'boolean'">
                                    <CustomCheckbox
                                        class="checkbox"
                                        :model-value="entry.value.toLowerCase() === 'true'"
                                        :label='`${entry.entryName} = "${entry.value}"`'
                                        :aria-label="entry.entryName"
                                        @update:model-value="(checked) => entry.value = checked ? 'true' : 'false'" />
                                </template>
                                <template v-else-if="entry.displayType === 'multi-select'">
                                    <MultiSelect
                                        placeholder="Select an option"
                                        :selected="entry.value.split(',')"
                                        :options="getSelectOptions(entry)"
                                        @selection-changed="(newSelection) => updateEntryMultiSelect(entry, newSelection)"/>
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
import MultiSelect from '../input/MultiSelect.vue';
import CustomCheckbox from '../input/CustomCheckbox.vue';
import {
    ConfigurationEntry,
    ConfigurationFile,
    ConfigurationSection,
    getSelectOptions, saveConfigurationFile
} from '../../utils/ConfigUtils';
import { ref } from 'vue';

export type ConfigEntryEditorProps = {
    configFile?: ConfigFile;
    configurationFile?: ConfigurationFile;
}

const props = defineProps<ConfigEntryEditorProps>();
const emits = defineEmits<{
    (e: 'changed'): void
}>();

const collapsedSections = ref<ConfigurationSection[]>([]);
const entriesWithExpandedComments = ref<ConfigurationEntry[]>([]);

function toggleSectionVisibility(section: ConfigurationSection) {
    const collapsedSectionIndex = collapsedSections.value.indexOf(section);
    if (collapsedSectionIndex >= 0) {
        collapsedSections.value.splice(collapsedSectionIndex, 1);
    } else {
        collapsedSections.value.push(section);
    }
}

function save() {
    saveConfigurationFile(props.configurationFile!);
    emits('changed');
}

function cancel() {
    emits('changed');
}

function isDisplayTooLong(entry: ConfigurationEntry): boolean {
    return true;
}

function getAppropriateCommentLines(entry: ConfigurationEntry) {
    if (!entriesWithExpandedComments.value.includes(entry)) {
        const commentLines = [...entry.commentLines]
            .filter(line => line.isDescription)
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

function updateEntryMultiSelect(entry: ConfigurationEntry, newSelections: string[]) {
    entry.value = newSelections.map(value => value.trim()).join(', ');
}

</script>

<style lang="scss" scoped>

#config-entry-wrapper {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    width: 100%;
}

#config-entry-main {
    width: 100%;
    display: grid;
    grid-template-rows: min-content 1fr;
}

#config-entries {
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-gap: 1rem;
}

.outer-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    border-bottom: 1px solid var(--v2-table-row-border-color);
}

.section-title {
    position: sticky;
    z-index: 100;
    top: 0;
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: fit-content;
}

.inner-row {
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 1px solid var(--v2-table-row-border-color);
}

.title {
    margin-bottom: 0;
}

#config-entry-actions {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: 0.5rem 2rem;
    background-color: var(--background);
    border-bottom: 1px solid var(--v2-table-row-border-color);
}

.checkbox {
    margin-top: 0.5rem;
}

.entry-info {
    padding-bottom: 0.5rem;
}

.metadata-container {
    border-left: 3px solid var(--v2-table-row-border-color);
    padding-left: 0.75rem;
    color: var(--v2-secondary-text-color);
}
</style>
