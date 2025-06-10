<template>
    <div>
        <Hero
            :title="configFile.getName()"
            subtitle="Editing config file"
            hero-type="primary"
        />
        <br/>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div v-if="configFile.getPath().toLowerCase().endsWith('.cfg')" class="margin-right non-selectable">
            <h3 class='subtitle is-3'>Sections</h3>
            <ul>
                <li v-for="(value, key) in dumpedConfigVariables" :key="`${key}-${value.toString()}-tab`">
                    <a :href="`#${key}`">{{ key }}</a>
                </li>
            </ul>
            <br/>
            <div v-for="(value, key) in dumpedConfigVariables" :key="`${key}-${value.toString()}-tab`">
                <div class="notification is-grey-lighter sticky-top">
                    <h4 :id="key" class='subtitle is-4'>{{ key }}</h4>
                </div>
                <div class="panel-block is-block settings-panel" v-for="(line, variable) in value" :key="`${configFile.getName()}-${key}-${variable}-${line.commentsExpanded}`">
                    <div class="settings-panel__content">
                        <p class="title is-6 is-marginless selectable">{{variable}}</p>
                        <p class="subtitle is-italic is-bold is-6 is-marginless">
                            <template v-if="getCommentDisplay(line.comments).split('\n').length > 4">
                                <span class="pre selectable" v-if="!line.commentsExpanded">{{getCommentDisplayShort(line.comments)}}</span>
                                <span class="pre selectable" v-else>{{getCommentDisplay(line.comments)}}</span>
                                <a @click="toggleEntryExpansion(key, variable)">
                                    <span v-if="!line.commentsExpanded">Show more</span>
                                    <span v-else>Show less</span>
                                </a>
                            </template>
                            <span class="pre" v-else>{{getCommentDisplay(line.comments)}}</span>
                        </p>
                        <br/>
                        <div class='settings-input-container'>
                            <template v-if='line.hasRange'>
                                <input
                                    type="range"
                                    class="slider is-fullwidth is-circle is-small"
                                    v-on:input="e => setConfigLineValue(line, e.target.value)"
                                    :value="parseFloat(line.value)"
                                    :min="line.getMinRange()"
                                    :max="line.getMaxRange()" />
                            </template>
                            <template v-if="line.allowedValues.length > 0">
                                <select class="select select--full" v-model="line.value">
                                    <option v-for="(opt, index) in line.allowedValues" :key="`opt-${key}-${configFile.getName()}-${variable}-${index}`">
                                        {{opt}}
                                    </option>
                                </select>
                            </template>
                            <input
                                v-else
                                v-model="line.value"
                                :id="`${key.toString().replace(/\s+/g, '-')}-${variable.toString().replace(/\s+/g, '-')}`"
                                class="input"
                                autocomplete="off"
                            />
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        </div>
        <div class="notification margin-right">
            <QuillEditor
                :modelValue="fileText"
                @update:modelValue="quillEditorValueUpdated"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ConfigLine from '../../model/file/ConfigLine';
import FsProvider from '../../providers/generic/file/FsProvider';
import ConfigFile from '../../model/file/ConfigFile';
import { DeferredInput, Hero } from '../all';
import QuillEditor from '../QuillEditor.vue';
import BepInExConfigUtils from '../../utils/BepInExConfigUtils';
import { onMounted, ref } from 'vue';

type ConfigEditLayoutProps = {
    configFile: ConfigFile;
}

const props = defineProps<ConfigEditLayoutProps>();
const emits = defineEmits<{
    (e: 'changed'): void;
}>();

const fileText = ref<string>("");
const dumpedConfigVariables = ref<{ [section: string]: { [variable: string]: ConfigLine } }>({});

onMounted(async () => {
    const fs = FsProvider.instance;
    fileText.value = (await fs.readFile(props.configFile.getPath())).toString();
    if (props.configFile.getPath().toLowerCase().endsWith(".cfg")) {
        dumpedConfigVariables.value = await BepInExConfigUtils.getBepInExConfigBreakdown(props.configFile.getPath());
    }
    window.scrollTo(0, 0);
});

function quillEditorValueUpdated(value: string) {
    fileText.value = value;
    updateFreeText(value);
}

function save() {
    if (props.configFile.getPath().toLowerCase().endsWith(".cfg")) {
        saveCfg();
    } else {
        saveNonCfg();
    }
}

async function saveCfg() {
    await BepInExConfigUtils.updateBepInExConfigFile(props.configFile.getPath(), fileText.value, dumpedConfigVariables.value);
    window.scrollTo(0, 0);
    emits('changed');
}

async function saveNonCfg() {
    const fs = FsProvider.instance;
    await fs.writeFile(props.configFile.getPath(), fileText.value);
    window.scrollTo(0, 0);
    emits('changed');
}

function cancel() {
    window.scrollTo(0, 0);
    emits('changed');
}

function updateFreeText(text: string) {
    fileText.value = text;
}

function getCommentDisplay(comments: string[]): string {
    return comments.map(value => value.trim())
        .join("\n")
        .trim()
        .replace(new RegExp("#+", "g"), "")
        .replace(new RegExp(";+", "g"), "")
        .replace(new RegExp("\n\\s", "g"), "\n")
        .trim();
}

function getCommentDisplayShort(comments: string[]): string {
    return comments.map(value => value.trim())
        .slice(0, 4)
        .join("\n")
        .trim()
        .replace(new RegExp("#+", "g"), "")
        .replace(new RegExp(";+", "g"), "")
        .replace(new RegExp("\n\\s+", "g"), "\n")
        .trim();
}

function toggleEntryExpansion(key: string, variable: string) {
    const oldLine = dumpedConfigVariables.value[key][variable];
    const newLine = new ConfigLine(oldLine.value, oldLine.comments, oldLine.allowedValues);
    newLine.commentsExpanded = !oldLine.commentsExpanded;
    dumpedConfigVariables.value[key][variable] = newLine;
    dumpedConfigVariables.value = JSON.parse(JSON.stringify(dumpedConfigVariables.value));
}

function setConfigLineValue(line: ConfigLine, value: number) {
    line.value = value.toString();
}

</script>
