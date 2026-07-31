<template>
    <Teleport to="#activity-bar__left">
        <div class="activity-bar__group">
            <button class="activity-bar__context-item" id="game-switch-button" @click.prevent.stop="changeGame">
                <img class="game-icon" :src="imageSrc" alt="Game icon"/>
                <span>{{ activeGame.displayName }}</span>
            </button>
            <span class="activity-bar__item-label non-selectable activity-bar__item-divider">/</span>
            <button class="activity-bar__context-item" @click.prevent.stop="changeProfile">
                <i class="fa fa-layer-group fa-xs"></i>
                <span>{{ profile.profileName }}</span>
            </button>
        </div>
        <div class="vertical-break"></div>
        <div class="activity-bar__group">
            <ActivityDropdown>
                <button class="activity-bar__action">
                    <span class="icon is-small"><i class="fa fa-share-alt fa-xs"></i></span>
                    <span>Export profile</span>
                </button>
                <template #popper>
                    <ul class="menu-list">
                        <li><a v-close-popper @click="store.dispatch('profileExport/exportProfileAsCode')"><i class="fa fa-fw fa-code icon--margin-right"></i>Export to code</a></li>
                        <li><a v-close-popper @click="store.dispatch('profileExport/exportProfileAsFile')"><i class="fa fa-fw fa-file-download icon--margin-right"></i>Export to file</a></li>
                    </ul>
                </template>
            </ActivityDropdown>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { ActivityDropdown } from '../all';
import { useGameImageComposable } from '../composables/GameImageComposable';

const store = getStore<State>();
const router = useRouter();

const activeGame = computed(() => store.state.activeGame);
const profile = computed(() => store.getters['profile/activeProfile']);

const { imageSrc, setIcon } = useGameImageComposable();
watch(() => activeGame.value.iconUrl, setIcon, { immediate: true });

function changeGame() {
    router.push('/');
}

function changeProfile() {
    router.push('/profiles');
}
</script>
