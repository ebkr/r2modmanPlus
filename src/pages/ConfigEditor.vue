<template>
    <div class="page-with-topbar">
        <ConfigSelectionLayout v-show="editing === null" @edit="bindEdit($event)"/>
        <ConfigEditLayout
            :config-file="editing"
            @changed="editing = null"
            v-if="editing !== null"/>
    </div>
</template>

<script lang="ts">

    import { Component, Vue } from 'vue-property-decorator';
    import ConfigSelectionLayout from '../components/config-components/ConfigSelectionLayout.vue';
    import ConfigFile from '../model/file/ConfigFile';
    import ConfigEditLayout from '../components/config-components/ConfigEditLayout.vue';

    @Component({
        components: {
            ConfigEditLayout,
            ConfigSelectionLayout
        }
    })
    export default class BetterConfigEditor extends Vue {
        public editing: ConfigFile | null = null;

        bindEdit(editing: ConfigFile | null) {
            this.editing = editing;
        }

    }

</script>
