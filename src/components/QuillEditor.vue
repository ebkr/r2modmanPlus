<!-- Referenced from https://pineco.de/wrapping-quill-editor-in-a-vue-component/ -->
<template>
    <div ref="editorElement" class="quill"></div>
</template>

<script lang="ts" setup>
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import { onMounted, ref, watchEffect } from 'vue';

type QuillEditorProps = {
    modelValue: string;
}

const props = defineProps<QuillEditorProps>();

const editorElement = ref<HTMLDivElement>();
let editor: Quill;

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void,
}>();

onMounted(() => {
    editor = new Quill(editorElement.value as Element, {
        modules: {
            toolbar: false,
        },
        theme: 'bubble',
        formats: []
    });
    editor.setText(props.modelValue);
    editor.on('text-change', () => update());
});

watchEffect(() => {
    const newText = props.modelValue;
    if (editor) {
        const selection = editor.getSelection();
        editor.setText(newText);
        if (selection) {
            editor.setSelection(Math.min(newText.length, selection.index), 0);
        }
    }
});

function update() {
    emits('update:modelValue', editor!.getText() ? editor!.getText() : '');
}
</script>
