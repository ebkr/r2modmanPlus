<script lang="ts" setup>
import { Progress } from '../all';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import * as DownloadUtils from '../../utils/DownloadUtils';
import FileUtils from '../../utils/FileUtils';
import { DownloadStatusEnum } from '../../model/enums/DownloadStatusEnum';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

function closeModal() {
    store.commit("closeDownloadProgressModal");
}

</script>

<template>
    <div>
        <div
            id='downloadProgressModal'
            :class="['modal', {'is-active':store.state.modals.isDownloadProgressModalOpen}]"
            v-if="store.getters['download/currentDownload'] !== null"
        >
            <div class="modal-background" @click="closeModal();"></div>
            <div class='modal-content'>
                <div class='notification is-info'>

                    <h3 v-if="DownloadUtils.statusIsDownloadOrExtract(store.getters['download/currentDownload'].status)" class='title'>
                        {{ t('translations.pages.manager.modals.downloadProgress.states.downloading', { modName: store.getters['download/currentDownload'].modName }) }}
                    </h3>
                    <h3 v-else-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.INSTALLING" class='title'>
                        {{ t('translations.pages.manager.modals.downloadProgress.states.installing', { modName: store.getters['download/currentDownload'].modName }) }}
                    </h3>

                    <p v-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.DOWNLOADING">
                        <i class="fas fa-download"/>
                        {{ t('translations.pages.manager.modals.downloadProgress.downloadProgress', { progress: store.getters['download/currentDownload'].downloadProgress, totalSize: FileUtils.humanReadableSize(store.getters['download/currentDownload'].totalDownloadSize) }) }}
                    </p>

                    <p v-else-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.EXTRACTING || store.getters['download/currentDownload'].status === DownloadStatusEnum.EXTRACTED">
                        <i class="fas fa-box-open"/>
                        {{ t('translations.pages.manager.modals.downloadProgress.extractionProgress', { progress: store.getters['download/currentDownload'].downloadProgress, totalSize: FileUtils.humanReadableSize(store.getters['download/currentDownload'].totalDownloadSize) }) }}
                    </p>

                    <p v-else>
                        <i class="fas fa-check"/>
                        Download complete
                    </p>

                    <Progress
                        :max='100'
                        :value="store.getters['download/currentDownload'].downloadProgress"
                        :className="['is-dark']"
                    />

                    <p v-if="store.getters['download/currentDownload'].installProgress">
                        <i class="fas fa-cog" spin />
                        {{ t('translations.pages.manager.modals.downloadProgress.installProgress', { progress: store.getters['download/currentDownload'].installProgress }) }}
                    </p>
                    <p v-else>
                        <i class="fas fa-cog" />
                        {{ t('translations.pages.manager.modals.downloadProgress.waitingForDownload') }}
                    </p>

                    <Progress
                        :max='100'
                        :value="store.getters['download/currentDownload'].installProgress"
                        :className="['is-dark']"
                    />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal();"></button>
        </div>
    </div>
</template>
