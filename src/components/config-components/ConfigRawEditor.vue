<template>
    <div id="config-raw-editor">
        <div id="config-raw-editor-actions">
            <button class="button is-info margin-right margin-right--half-width" @click="save">{{ t('translations.pages.configEditor.editConfig.actions.save') }}</button>
            <button class="button is-danger" @click="cancel">{{ t('translations.pages.configEditor.editConfig.actions.cancel') }}</button>
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
import { useI18n } from 'vue-i18n';

export type ConfigRawEditorProps = {
    filePath: string;
}

const { t } = useI18n();

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
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
}

#config-raw-editor-actions {
    position: sticky;
    top: 0;
    z-index: 100;
    text-align: right;
    padding: 0.5rem 2rem 1rem 0;
    background-color: var(--background);
}

#config-raw-editor-component-wrapper {
    margin-bottom: 1rem;
}
</style>
