<template>
    <div class="notification margin-right">
        <QuillEditor
            :modelValue="fileText"
            @update:modelValue="quillEditorValueUpdated"/>
    </div>
</template>
<script setup lang="ts">
import QuillEditor from "../../QuillEditor.vue";
import {ref} from "vue";

const fileText = ref<string>("");

function updateFreeText(text: string) {
    fileText.value = text;
}

function quillEditorValueUpdated(value: string) {
    fileText.value = value;
    updateFreeText(value);
}
</script>
