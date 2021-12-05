<template>
    <a class="panel-block is-block settings-panel" @click="emitClick()">
        <span class="icon is-pulled-right">
            <i :class="['fas', icon]" aria-hidden="true"></i>
        </span>
        <div class="settings-panel__content">
            <p class="title is-6 is-marginless">{{action}}</p>
            <p class="subtitle is-italic is-bold is-6 is-marginless">{{description}}</p>
            <p class="subtitle is-6 text-grey" v-if="reactiveValue !== null">{{reactiveValue}}</p>
        </div>
    </a>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Timeout = NodeJS.Timeout;

@Component
    export default class SettingsItem extends Vue {

        private reactiveValue: any | null = null;
        private timeout: Timeout | null = null;

        @Prop({default: ""})
        private action: string | undefined;

        @Prop({default: ""})
        private description: string | undefined;

        @Prop({default: () => Promise.resolve() })
        private value!: () => Promise<any>;

        @Prop({default: ""})
        private icon: string | undefined;

        async mounted() {
            if (this.timeout !== null) {
                clearInterval(this.timeout);
            }
            this.reactiveValue = await this.value();
            this.timeout = setInterval(async () => {
                this.reactiveValue = await this.value();
            }, 1000);
        }

        destroyed() {
            if (this.timeout !== null) {
                clearInterval(this.timeout);
            }
        }

        emitClick() {
            this.$emit("click");
            setTimeout(async () => {
                this.reactiveValue = await this.value();
            }, 20);
        }

    }
</script>
