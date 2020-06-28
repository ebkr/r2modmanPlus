<template>
    <a class="panel-block is-block settings-panel" @click="emitClick()">
        <span class="icon is-pulled-right">
            <i :class="['fas', icon]" aria-hidden="true"></i>&nbsp;&nbsp;
        </span>
        <div class="settings-panel__content">
            <p class="title is-6 is-marginless">{{action}}</p>
            <p class="subtitle is-italic is-bold is-6 is-marginless">{{description}}</p>
            <p class="subtitle is-6 text-grey">{{value}}</p>
        </div>
    </a>
</template>

<script lang="ts">
    import { Prop, Vue } from 'vue-property-decorator';
    import Component from 'vue-class-component';

    @Component
    export default class SettingsItem extends Vue {

        @Prop({default: ""})
        private action: string | undefined;

        @Prop({default: ""})
        private description: string | undefined;

        @Prop({default: ""})
        private value: any | undefined;

        @Prop({default: ""})
        private icon: string | undefined;

        emitClick() {
            this.$emit("click");
        }

    }
</script>
