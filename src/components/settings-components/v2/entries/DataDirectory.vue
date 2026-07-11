<script lang="ts" setup>
import { ref } from 'vue';
import PathResolver from '../../../../r2mm/manager/PathResolver';
import SettingsViewWrapper from '../SettingsViewWrapper.vue';

const dataDirectory = ref<string>(PathResolver.ROOT || 'Not set');

function selectDirectory() {
    console.log("Should select");
}
</script>

<template>
    <SettingsViewWrapper>
        <template #title>Data folder</template>
        <template #description>
            The folder where mods are stored for all games and profiles.
            The folder will not be deleted, and existing profiles will not carry across.
        </template>
        <div class="data-directory-setting">
            <div class="data-directory-setting__field">
                <input
                    class="input data-directory-setting__input"
                    type="text"
                    :value="dataDirectory"
                    readonly
                />
                <button class="button" @click="selectDirectory">Change</button>
                <button class="button" @click="selectDirectory">Browse</button>
            </div>
        </div>
    </SettingsViewWrapper>
</template>

<style lang="scss" scoped>
.data-directory-setting {
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
</style>
