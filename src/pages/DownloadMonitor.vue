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

                                <div v-if="downloadObject.failed">
                                    <p>Download failed</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-danger']"
                                    />
                                </div>

                                <div v-else-if="downloadObject.downloadProgress === 100 && downloadObject.installProgress === 100">
                                    <p>Download complete</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-success']"
                                    />
                                </div>

                                <div v-else class="row">

                                    <div class="col">
                                        <p v-if="downloadObject.downloadProgress < 100">Downloading: {{ downloadObject.modName }}</p>
                                        <p v-else>Downloading:</p>
                                        <p>{{Math.min(Math.floor(downloadObject.downloadProgress), 100)}}% complete</p>
                                        <Progress
                                            :max='100'
                                            :value='downloadObject.downloadProgress'
                                            :className="['is-info']"
                                        />
                                    </div>

                                    <div v-if="downloadObject.downloadProgress < 100" class="col">
                                        <p>Installing:</p>
                                        <p>Waiting for download to finish</p>
                                        <Progress
                                            :max='100'
                                            :value='0'
                                            :className="['is-info']"
                                        />
                                    </div>
                                    <div v-else class="col">
                                        <p>Installing: {{ downloadObject.modName }}</p>
                                        <p>{{Math.min(Math.floor(downloadObject.installProgress), 100)}}% complete</p>
                                        <Progress
                                            :max='100'
                                            :value='downloadObject.installProgress'
                                            :className="['is-info']"
                                        />
                                    </div>

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
