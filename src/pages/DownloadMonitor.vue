<template>
    <div>
        <Hero :title="$t(`pages.download.title`)" :subtitle="$t(`pages.download.subtitle`)" hero-type="is-info"/>
        <template v-if="activeDownloads.length === 0">
            <div class='text-center top'>
                <div class="margin-right">
                    <br/>
                    <h3 class='title is-4'>{{ $t(`pages.download.nothing`) }}</h3>
                    <h4 class='subtitle is-5'>
                        {{ $t(`pages.download.click`) }}<router-link :to="{name: 'manager.online'}">{{ $t(`pages.download.here`) }}</router-link>{{ $t(`pages.download.download`) }}
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
                                <p v-if="downloadObject.progress < 100">{{ $t(`pages.download.downloading`) }}{{ downloadObject.modName }}</p>
                                <p>{{ $t(`pages.download.progress`, {progress: Math.min(Math.floor(downloadObject.progress), 100)}) }}</p>
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
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { Hero } from '../components/all';
import DownloadModModal from '../components/views/DownloadModModal.vue';
import Progress from '../components/Progress.vue';
import Timeout = NodeJS.Timeout;

@Component({
    components: {
        Progress,
        Hero,
    }
})
export default class DownloadMonitor extends Vue {
    private refreshInterval!: Timeout;
    private activeDownloads: [number, any][] = [];

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
