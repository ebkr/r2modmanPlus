<!-- Referenced from https://pineco.de/wrapping-quill-editor-in-a-vue-component/ -->
<template>
    <div class="notification">
        <div ref="editor" class="quill"></div>
    </div>
</template>

<script lang="ts">
    import Quill from 'quill';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.bubble.css';

    import { Component, Model, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class Editor extends Vue {

        @Model("input", {type: String, required: true})
        private textValue!: string;

        private editor: Quill | null = null;

        mounted() {
            this.editor = new Quill(this.$refs.editor as Element, {
                modules: {
                    toolbar: false
                },
                theme: 'bubble',
                formats: []
            });
            this.editor.setText(this.textValue || "");
            this.editor.on('text-change', () => this.update());
        }

        @Watch("textValue")
        private updatedModel(newValue: string) {
            if (this.editor !== null) {
                const selection = this.editor.getSelection();
                this.editor.setText(newValue);
                if (selection) {
                    this.editor.setSelection(Math.min(newValue.length, selection.index), 0);
                }
            }
        }

        update() {
            this.$emit('input', this.editor!.getText() ? this.editor!.getText() : '');
        }
    }
</script>
