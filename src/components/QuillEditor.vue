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

    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Editor extends Vue {

        @Prop({default: ''})
        private value: string | undefined;

        private editor: Quill | null = null;

        mounted() {
            this.editor = new Quill(this.$refs.editor as Element, {
                modules: {
                    toolbar: false
                },
                theme: 'bubble',
                formats: []
            });
            this.editor.setText(this.value!);
            this.editor.on('text-change', () => this.update());
        }

        update() {
            this.$emit('input', this.editor!.getText() ? this.editor!.getText() : '');
        }
    }
</script>
