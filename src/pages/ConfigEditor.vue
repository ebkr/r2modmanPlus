<template>
    <div class='columns'>
        <div class="column non-selectable" :class="navbarClass">
            <NavigationMenu view="config-editor"
                @clicked-installed="route('installed')"
                @clicked-online="route('online')"
                @clicked-settings="route('settings')"
                @clicked-help="route('help')"
            />
        </div>
        <div class="column" :class="contentClass">
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
    import ConfigFile from '../model/file/ConfigFile';
    import ConfigEditLayout from '../components/config-components/ConfigEditLayout.vue';
    import NavigationMenuProvider from '../providers/components/loaders/NavigationMenuProvider';

    @Component({
        components: {
            NavigationMenu: NavigationMenuProvider.provider,
            ConfigEditLayout,
            ConfigSelectionLayout
        }
    })
    export default class BetterConfigEditor extends Vue {

        @Prop({default: "is-one-quarter"})
        private navbarClass!: string;

        @Prop({default: "is-three-quarters"})
        private contentClass!: string;

        private editing: ConfigFile | null = null;

        bindEdit(editing: ConfigFile | null) {
            this.editing = editing;
        }

        route(ref: string) {
            this.$router.replace(`/manager?view=${ref}`);
        }

    }

</script>
