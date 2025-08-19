<script lang="ts" setup>
import { Progress } from '../all';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import FileUtils from '../../utils/FileUtils';

const store = getStore<State>();

function closeModal() {
    store.commit("closeDownloadProgressModal");
}

</script>

<template>
    <div>
        <div
            id='downloadProgressModal'
            :class="['modal', {'is-active':$store.state.modals.isDownloadProgressModalOpen}]"
            v-if="$store.getters['download/currentDownload'] !== null"
        >
            <div class="modal-background" @click="closeModal();"></div>
            <div class='modal-content'>
                <div class='notification is-info'>

                    <h3 v-if="$store.getters['download/currentDownload'].downloadProgress < 100" class='title'>
                        Downloading {{$store.getters['download/currentDownload'].modName}}
                    </h3>
                    <h3 v-else class='title'>
                        Installing {{$store.getters['download/currentDownload'].modName}}
                    </h3>

                    <p>
                        Downloading: {{$store.getters['download/currentDownload'].downloadProgress}}% complete of
                        {{FileUtils.humanReadableSize($store.getters['download/currentDownload'].totalDownloadSize)}}
                    </p>

                    <Progress
                        :max='100'
                        :value="$store.getters['download/currentDownload'].downloadProgress"
                        :className="['is-dark']"
                    />

                    <p v-if="$store.getters['download/currentDownload'].installProgress">
                        Installing: {{$store.getters['download/currentDownload'].installProgress}}% complete
                    </p>
                    <p v-else>Installing: waiting for download to finish</p>

                    <Progress
                        :max='100'
                        :value="$store.getters['download/currentDownload'].installProgress"
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal();"></button>
        </div>
    </div>
</template>
