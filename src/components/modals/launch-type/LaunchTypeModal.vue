<script setup lang="ts">
import ModalCard from '../../ModalCard.vue';
import {LaunchTypeModalOpen} from "../../../components/modals/launch-type/LaunchTypeRefs";
import {computed, ref, watchEffect} from "vue";
import Game from "../../../model/game/Game";
import {getStore} from "../../../providers/generic/store/StoreProvider";
import {State} from "../../../store";
import {getLaunchType, LaunchType} from "../../../model/real_enums/launch/LaunchType";
import {areWrapperArgumentsProvided, getDeterminedLaunchType, getWrapperLaunchArgs} from "../../../utils/LaunchUtils";
import CopyToClipboardButton from "../../buttons/CopyToClipboardButton.vue";
import ManagerSettings from "../../../r2mm/manager/ManagerSettings";

const store = getStore<State>();

const activeGame = computed<Game>(() => store.state.activeGame);
const launchOption = ref<LaunchType>(LaunchType.AUTO);
const determinedLaunchType = ref<LaunchType>(LaunchType.AUTO);
const wrapperProvided = ref<boolean>(false);

const launchArgs = ref<string>("");
getWrapperLaunchArgs().then(value => launchArgs.value = value);

watchEffect(async () => {
    determinedLaunchType.value = await getDeterminedLaunchType(activeGame.value, launchOption.value);
    wrapperProvided.value = await areWrapperArgumentsProvided(activeGame.value);
})

getLaunchType(activeGame.value)
    .then(launchType => launchOption.value = launchType);

function closeModal() {
  LaunchTypeModalOpen.value = false;
}

async function updateAndClose() {
  console.debug(
      "Updating launch type for game.",
      `Active game in Vuex: "${store.state.activeGame.settingsIdentifier}".`,
      `Active game in local ref: "${activeGame.value.settingsIdentifier}".`,
  );
  const settings = await ManagerSettings.getSingleton(activeGame.value);
  settings.logActiveGameInDexieStore();
  await settings.setLaunchType(launchOption.value);
  closeModal();
}

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
          <div v-if="determinedLaunchType === LaunchType.NATIVE && !wrapperProvided" class="margin-top">
            <p>
              We were unable to determine if the required wrapper arguments have been set.
            </p>
            <p>
              If you have not yet done this manually, please add the following launch arguments to the game's properties on Steam:
            </p>
            <div>
              <code>
                {{ launchArgs }}
              </code>
            </div>
            <div class="margin-top">
              <CopyToClipboardButton :copy-value="launchArgs" id="launch-type-modal-copy-button">
                Copy launch arguments
              </CopyToClipboardButton>
            </div>
          </div>
        </template>
        <template v-slot:footer>
            <button id="launch-type-modal-update-button" class="button is-info" @click="updateAndClose">
                Update
            </button>
        </template>
    </ModalCard>
</template>
