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
                <div class="container">
                    <div class="row border-at-bottom pad pad--sides">
                        <div class="is-flex-grow-1 margin-right card is-shadowless">
                            <p><strong>{{ downloadObject.initialMods.join(", ") }}</strong></p>

                            <div class="row" v-if="downloadObject.failed">
                                <div class="col">
                                    <p>Download failed</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-danger']"
                                    />
                                </div>
                            </div>

                            <div class="row" v-else-if="downloadObject.downloadProgress === 100 && downloadObject.installProgress === 100">
                                <div class="col">
                                    <p>Download complete</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-success']"
                                    />
                                </div>
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
                        <button
                            v-if="downloadObject.failed || (downloadObject.downloadProgress === 100 && downloadObject.installProgress === 100)"
                            class="button download-item-action-button"
                            v-tooltip.left="'Remove'"
                            @click="$store.commit('download/removeDownload', downloadObject)"
                        >
                            <i class="fas fa-times" />
                        </button>
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

<style lang="scss" scoped>
.download-item-action-button {
    font-size: 1.5rem;
    padding: 0;
    height: 1em;
    margin: auto 1rem;
    border: none;
}
</style>
