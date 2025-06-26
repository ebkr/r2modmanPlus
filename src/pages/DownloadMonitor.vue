<template>
    <div id="download-monitor-view">
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
            <div class="download-monitor-action-buttons border-at-bottom">
                <button
                    class="button ghost"
                    @click="$store.commit('download/removeAllInactive')"
                >
                    <i class="fas fa-times mr-2" />Clear finished
                </button>
            </div>
            <div v-for="(downloadObject, index) of $store.getters['download/profileDownloadsNewestFirst']" :key="`download-progress-${index}`">
                <div class="container">
                    <div class="row no-wrap border-at-bottom pad pad--sides">
                        <div class="is-flex-grow-1 margin-right card is-shadowless">
                            <p><strong>{{ downloadObject.initialMods.map(tsCombo => tsCombo.getUserFriendlyString()).join(", ") }}</strong></p>

                            <div class="row" v-if="downloadObject.status === DownloadStatusEnum.FAILED">
                                <div class="col">
                                    <p>Download failed</p>
                                    <Progress
                                        :max='100'
                                        :value='100'
                                        :className="['is-danger']"
                                    />
                                </div>
                            </div>

                            <div class="row" v-else-if="downloadObject.status === DownloadStatusEnum.DONE">
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
                                    <p v-if="downloadObject.status === DownloadStatusEnum.DOWNLOADING">Downloading: {{ downloadObject.modName }}</p>
                                    <p v-else>Downloading:</p>
                                    <p>{{Math.min(Math.floor(downloadObject.downloadProgress), 100)}}% complete</p>
                                    <Progress
                                        :max='100'
                                        :value='downloadObject.downloadProgress'
                                        :className="['is-info']"
                                    />
                                </div>

                                <div v-if="downloadObject.status === DownloadStatusEnum.DOWNLOADING" class="col">
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
                            v-if="downloadObject.status === DownloadStatusEnum.FAILED"
                            class="button download-item-action-button"
                            v-tooltip.left="'Retry'"
                            @click="$store.dispatch('download/retryDownload', { download: downloadObject, hideModal: true })"
                        >
                            <i class="fas fa-redo redo-icon" />
                        </button>
                        <button
                            v-if="downloadObject.status === DownloadStatusEnum.FAILED || downloadObject.status === DownloadStatusEnum.DONE"
                            class="button download-item-action-button"
                            v-tooltip.left="'Remove'"
                            @click="$store.commit('download/removeDownload', downloadObject)"
                        >
                            <i class="fas fa-times x-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>

import { Hero } from '../components/all';
import Progress from '../components/Progress.vue';
import { DownloadStatusEnum } from '../model/enums/DownloadStatusEnum';
</script>

<style lang="scss" scoped>
#download-monitor-view {
    width: 100%;
}

.download-item-action-button {
    padding: 0;
    height: 1em;
    margin: auto 1rem;
    border: none;
}

.download-monitor-action-buttons {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0.5rem;
    text-align: right;
    background-color: var(--background);
}

// icons are different sizes, so we need to compensate for that
.x-icon {
    font-size: 1.5rem; 
}

.redo-icon {
    font-size: 1.125rem; 
}
</style>
