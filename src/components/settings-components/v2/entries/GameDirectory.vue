<script lang="ts" setup>
import Game from '../../../../model/game/Game';
import { getStore } from '../../../../providers/generic/store/StoreProvider';
import { State } from '../../../../store';
import { computed, onMounted, ref, watch } from 'vue';
import ManagerSettings from '../../../../r2mm/manager/ManagerSettings';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';
import { StorePlatform } from 'src/model/platform/StorePlatform';

const store = getStore<State>();

const activeGame = computed<Game>(() => store.state.activeGame);
const settings = ref<ManagerSettings | null>(null);

const gameDirectory = computed<string>(() =>
    settings.value?.getContext().gameSpecific.gameDirectory || 'Not set'
);

onMounted(async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

watch(activeGame, async () => {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
});

function selectDirectory() {
    console.log("Should select");
}

function autoDiscoverDirectory() {
    console.log("Should auto-discover from running processes");
}
</script>

<template>
    <SettingsViewWrapper>
        <template #title>{{ activeGame.displayName }} folder</template>
        <template #description>
            The game directory is required to place the appropriate files correctly.
            <span v-if="StorePlatform[activeGame.activePlatform.storePlatform] === StorePlatform.steam">
                However <code class="code">{{ activeGame.displayName }}</code> will launch without mods if this is not set appropriately.
            </span>
        </template>
        <div class="game-directory-setting">
            <div class="game-directory-setting__field">
                <input
                    class="input game-directory-setting__input"
                    type="text"
                    :value="gameDirectory"
                    readonly
                />
                <button class="button" @click="selectDirectory">Change</button>
                <button class="button" @click="selectDirectory">Browse</button>
            </div>
            <a href="#" class="help-link" @click.prevent="autoDiscoverDirectory">I'm not sure what this should be</a>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.game-directory-setting {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex: 1;

    &__field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__input {
        flex: 1;
        min-width: 14rem;
        max-width: 30rem;
    }
}

.help-link {
    font-size: 0.9rem;
    align-self: flex-start;
}
</style>
