<script setup lang="ts">
import ModalCard from '../../ModalCard.vue';
import {LaunchTypeModalOpen} from "../../../components/modals/launch-type/LaunchTypeRefs";
import ManagerSettings from "src/r2mm/manager/ManagerSettings";
import {computed, ref, watchEffect} from "vue";
import Game from "src/model/game/Game";
import {getStore} from "src/providers/generic/store/StoreProvider";
import {State} from "src/store";
import {getLaunchType, LaunchType} from "src/model/real_enums/launch/LaunchType";
import {getDeterminedLaunchType, isProtonRequired} from "src/utils/LaunchUtils";
import EnumResolver from "src/model/enums/_EnumResolver";

const store = getStore<State>();

function closeModal() {
    LaunchTypeModalOpen.value = false;
}

const activeGame = computed<Game>(() => store.state.activeGame);
const launchOption = ref<string>(LaunchType.AUTO);
const determinedLaunchType = ref(LaunchType.AUTO);

watchEffect(async () => {
    const launchTypeString = launchOption.value;
    const launchType = EnumResolver.from<LaunchType>(LaunchType, launchTypeString);
    determinedLaunchType.value = await getDeterminedLaunchType(activeGame.value, LaunchType[launchType]);
})

getLaunchType(activeGame.value)
    .then(launchType => launchOption.value = launchType)

</script>

<template>
    <ModalCard id="launch-type-modal" v-show="LaunchTypeModalOpen" :is-active="LaunchTypeModalOpen" :can-close="true" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">Set launch behaviour</h2>
        </template>
        <template v-slot:body>
            <div>
                <input id="launch-type-option-auto" type="radio" name="launch-type-option" :value="LaunchType.AUTO" v-model="launchOption"/>
                <label for="launch-type-option-auto"><span class="margin-right margin-right--half-width"/>Auto</label>
            </div>
            <div>
                <input id="launch-type-option-native" type="radio" name="launch-type-option" :value="LaunchType.NATIVE" v-model="launchOption"/>
                <label for="launch-type-option-native"><span class="margin-right margin-right--half-width"/>Native</label>
            </div>
            <div>
                <input id="launch-type-option-proton" type="radio" name="launch-type-option" :value="LaunchType.PROTON" v-model="launchOption"/>
                <label for="launch-type-option-proton"><span class="margin-right margin-right--half-width"/>Proton</label>
            </div>
            <p v-if="launchOption === LaunchType.AUTO" class="margin-top">
                By selecting <strong>Auto</strong> we have determined that {{ activeGame.displayName }} will be launched under
                <strong class="tag">{{ determinedLaunchType }}</strong>
                mode.
            </p>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="closeModal">
                Close
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
