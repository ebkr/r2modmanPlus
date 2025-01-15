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
