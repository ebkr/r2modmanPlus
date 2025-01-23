<template>
    <div>
        <Hero title="Downloads" subtitle="Monitor progress of downloads" hero-type="primary"/>
        <template v-if="$store.state.download.allDownloads.length === 0">
            <div class='text-center top'>
                <div class="margin-right">
                    <br/>
                    <h3 class='title is-4'>You don't have anything downloading.</h3>
                    <h4 class='subtitle is-5'>
                        Click <router-link :to="{name: 'manager.online'}">here</router-link> to download something.
                    </h4>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-for="(downloadObject, index) of $store.getters['download/newestFirst']" :key="`download-progress-${index}`">
                <div>
                    <div class="container margin-right">
                        <div class="border-at-bottom pad pad--sides">
                            <div class="card is-shadowless">
                                <p><strong>{{ downloadObject.initialMods.join(", ") }}</strong></p>

                                <div v-if="!downloadObject.failed && downloadObject.downloadProgress < 100">
                                    <p>Downloading: {{ downloadObject.modName }}</p>
                                    <p>{{Math.min(Math.floor(downloadObject.downloadProgress), 100)}}% complete</p>
                                    <Progress
                                        :max='100'
                                        :value='downloadObject.downloadProgress'
                                        :className="['is-info']"
                                    />
                                </div>

                                <div v-else-if="!downloadObject.failed && downloadObject.installationProgress < 100">
                                    <p v-if="downloadObject.installationProgress < 100">Installing: {{ downloadObject.modName }}</p>
                                    <p>{{Math.min(Math.floor(downloadObject.installationProgress), 100)}}% complete</p>
                                    <Progress
                                        :max='100'
                                        :value='downloadObject.installationProgress'
                                        :className="['is-info']"
                                    />
                                </div>

                                <div v-else-if="downloadObject.failed">
                                    <p>{{downloadObject.failed ? "Download failed" : `${Math.min(Math.floor(downloadObject.installationProgress), 100)}% complete`}}</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-danger']"
                                    />
                                </div>

                                <div v-else>
                                    <p>Status unknown</p>
                                </div>
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
import Progress from '../components/Progress.vue';

@Component({
    components: {
        Progress,
        Hero,
    }
})
export default class DownloadMonitor extends Vue {
}

</script>
