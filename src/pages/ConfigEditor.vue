<template>
    <div class='columns'>
        <div class="column is-one-quarter non-selectable">
            <NavigationMenu view="config-editor"
                @clicked-installed="route('installed')"
                @clicked-online="route('online')"
                @clicked-settings="route('settings')"
                @clicked-help="route('help')"
            />
        </div>
        <div class="column is-three-quarters">
            <ConfigSelectionLayout v-show="editing === null" @edit="bindEdit($event)"/>
            <ConfigEditLayout
                :config-file="editing"
                @changed="editing = null"
                v-if="editing !== null"/>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ConfigSelectionLayout from '../components/config-components/ConfigSelectionLayout.vue';
    import NavigationMenu from '../components/navigation/NavigationMenu.vue';
    import ConfigFile from '../model/file/ConfigFile';
    import ConfigEditLayout from '../components/config-components/ConfigEditLayout.vue';

    @Component({
        components: {
            ConfigEditLayout,
            ConfigSelectionLayout,
            NavigationMenu
        }
    })
    export default class BetterConfigEditor extends Vue {

        private editing: ConfigFile | null = null;

        bindEdit(editing: ConfigFile | null) {
            this.editing = editing;
        }

        route(ref: string) {
            this.$router.replace(`/manager?view=${ref}`);
        }

    }

</script>
