<template>
    <div id="config-raw-editor">
        <div id="config-raw-editor-actions">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div id="config-raw-editor-component-wrapper" class="notification margin-right">
            <QuillEditor
                :modelValue="fileText"
                @update:modelValue="quillEditorValueUpdated"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import QuillEditor from "../QuillEditor.vue";
import {ref} from "vue";
import FsProvider from "../../providers/generic/file/FsProvider";

export type ConfigRawEditorProps = {
    filePath: string;
}

const props = defineProps<ConfigRawEditorProps>();
const emits = defineEmits<{
    (e: 'changed'): void;
}>();

const fileText = ref<string>("");

FsProvider.instance.readFile(props.filePath)
    .then(buffer => fileText.value = buffer.toString());

function updateFreeText(text: string) {
    fileText.value = text;
}

function quillEditorValueUpdated(value: string) {
    fileText.value = value;
    updateFreeText(value);
}

async function save() {
    await FsProvider.instance.writeFile(props.filePath, fileText.value)
    emits('changed');
}

function cancel() {
    emits('changed');
}
</script>

<style lang="scss" scoped>
#config-raw-editor {
    height: 100%;
    overflow-y: hidden;
    display: grid;
    grid-template-rows: min-content 1fr;
    margin: 0;
    padding: 0;
}

#config-raw-editor-actions {
    text-align: right;
    padding-right: 2rem;
    padding-bottom: 1rem;
}

#config-raw-editor-component-wrapper {
    overflow-y: auto;
    margin-bottom: 1rem;
}
</style>
