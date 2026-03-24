<script lang="ts" setup>
import { Progress } from '../all';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import * as DownloadUtils from '../../utils/DownloadUtils';
import FileUtils from '../../utils/FileUtils';
import { DownloadStatusEnum } from '../../model/enums/DownloadStatusEnum';

const store = getStore<State>();

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

                    <h3 v-if="DownloadUtils.statusIsDownloadOrExtract(store.getters['download/currentDownload'].status)" class='title'> {{ $t('DownloadProgressModal.downloading') }} {{store.getters['download/currentDownload'].modName}}
                    </h3>
                    <h3 v-else-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.INSTALLING" class='title'> {{ $t('DownloadProgressModal.installing') }} {{store.getters['download/currentDownload'].modName}}
                    </h3>


                    <p v-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.DOWNLOADING">
                        <i class="fas fa-download"/> {{ $t('DownloadProgressModal.downloading_1') }} {{store.getters['download/currentDownload'].downloadProgress}}{{ $t('DownloadProgressModal.of') }} {{FileUtils.humanReadableSize(store.getters['download/currentDownload'].totalDownloadSize)}}
                    </p>

                    <p v-else-if="store.getters['download/currentDownload'].status === DownloadStatusEnum.EXTRACTING || store.getters['download/currentDownload'].status === DownloadStatusEnum.EXTRACTED">
                        <i class="fas fa-box-open"/> {{ $t('DownloadProgressModal.extracting') }} {{store.getters['download/currentDownload'].downloadProgress}}{{ $t('DownloadProgressModal.of') }} {{FileUtils.humanReadableSize(store.getters['download/currentDownload'].totalDownloadSize)}}
                    </p>

                    <p v-else>
                        <i class="fas fa-check"/>
                        {{ $t('DownloadProgressModal.download_complete') }}
                    </p>

                    <Progress
                        :max='100'
                        :value="store.getters['download/currentDownload'].downloadProgress"
                        :className="['is-dark']"
                    />

                    <p v-if="store.getters['download/currentDownload'].installProgress">
                        <i class="fas fa-cog" spin /> {{ $t('DownloadProgressModal.installing_1') }} {{store.getters['download/currentDownload'].installProgress}}%
                    </p>
                    <p v-else>
                        <i class="fas fa-cog" />
                        {{ $t('DownloadProgressModal.installing') }}{{ $t('DownloadProgressModal.waiting_for_download_to_finis') }} </p>

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
