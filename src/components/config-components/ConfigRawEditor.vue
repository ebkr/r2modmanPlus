<template>
    <div>
        <div class="sticky-top sticky-top--buttons margin-right">
            <button class="button is-info margin-right margin-right--half-width" @click="save">Save</button>
            <button class="button is-danger" @click="cancel">Cancel</button>
        </div>
        <div class="notification margin-right">
            <QuillEditor
                :modelValue="fileText"
                @update:modelValue="quillEditorValueUpdated"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import QuillEditor from "../QuillEditor.vue";
import {ref} from "vue";
import FsProvider from "src/providers/generic/file/FsProvider";

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
