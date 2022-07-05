<template>
    <div class='columns'>
        <div class="column non-selectable" :class="navbarClass">
            <NavigationMenu view="online"
                            @clicked-installed="route('installed')"
                            @clicked-online="route('online')"
                            @clicked-settings="route('settings')"
                            @clicked-serverlist="route('serverlist')"
                            @clicked-config-editor="goto('/config-editor')"
                            @clicked-help="goto('/help')"
            />
        </div>
        <div class="column" :class="contentClass">
            <Hero title="Downloads" subtitle="Monitor progress of downloads" hero-type="is-info"/>
            <template v-if="activeDownloads.length === 0">
                <div class='text-center top'>
                    <div class="margin-right">
                        <br/>
                        <h3 class='title is-4'>You don't have anything downloading.</h3>
                        <h4 class='subtitle is-5'>Click <a @click="route('online')">here</a> to download something.
                        </h4>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-for="([assignId, downloadObject], index) of activeDownloads" :key="`download-progress-${index}`">
                    <div>
                        <div class="container margin-right">
                            <div class="border-at-bottom pad pad--sides">
                                <div class="card is-shadowless">
                                    <p><strong>{{ downloadObject.initialMods.join(", ") }}</strong></p>
                                    <p v-if="downloadObject.progress < 100">Downloading: {{ downloadObject.modName }}</p>
                                    <p>{{Math.min(Math.floor(downloadObject.progress), 100)}}% complete</p>
                                    <Progress v-if="!downloadObject.failed"
                                        :max='100'
                                        :value='downloadObject.progress'
                                        :className="['is-info']"
                                    />
                                    <Progress v-else-if="downloadObject.failed"
                                        :max='100'
                                        :value='100'
                                        :className="['is-danger']"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Hero } from '../components/all';
import NavigationMenuProvider from '../providers/components/loaders/NavigationMenuProvider';
import DownloadModModal from '../components/views/DownloadModModal.vue';
import Progress from '../components/Progress.vue';
import Timeout = NodeJS.Timeout;

@Component({
    components: {
        Progress,
        Hero,
        NavigationMenu: NavigationMenuProvider.provider,
    }
})
export default class DownloadMonitor extends Vue {

    @Prop({ default: 'is-one-quarter' })
    private navbarClass!: string;

    @Prop({ default: 'is-three-quarters' })
    private contentClass!: string;

    private refreshInterval!: Timeout;
    private activeDownloads: [number, any][] = [];

    route(ref: string) {
        this.$router.replace(`/manager?view=${ref}`);
    }

    goto(ref: string) {
        this.$router.replace(ref);
    }

    created() {
        this.activeDownloads = [...DownloadModModal.allVersions].reverse();
        this.refreshInterval = setInterval(() => {
            this.activeDownloads = [...DownloadModModal.allVersions].reverse();
        }, 100);
    }

    destroyed() {
        clearInterval(this.refreshInterval);
    }

}

</script>
