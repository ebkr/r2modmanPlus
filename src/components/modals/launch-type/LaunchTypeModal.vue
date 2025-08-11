<script setup lang="ts">
import ModalCard from '../../ModalCard.vue';
import {LaunchTypeModalOpen} from "../../../components/modals/launch-type/LaunchTypeRefs";
import {computed, ref, watchEffect} from "vue";
import Game from "../../../model/game/Game";
import {getStore} from "../../../providers/generic/store/StoreProvider";
import {State} from "../../../store";
import {getLaunchType, LaunchType} from "../../../model/real_enums/launch/LaunchType";
import {areWrapperArgumentsProvided, getDeterminedLaunchType, getWrapperLaunchArgs} from "../../../utils/LaunchUtils";
import EnumResolver from "../../../model/enums/_EnumResolver";
import CopyToClipboardButton from "../../buttons/CopyToClipboardButton.vue";
import ManagerSettings from "../../../r2mm/manager/ManagerSettings";
import { useI18n } from 'vue-i18n';

const store = getStore<State>();
const { t } = useI18n();

const activeGame = computed<Game>(() => store.state.activeGame);
const launchOption = ref<string>(LaunchType.AUTO);
const determinedLaunchType = ref<LaunchType>(LaunchType.AUTO);
const wrapperProvided = ref<boolean>(false);

const launchArgs = ref<string>("");
getWrapperLaunchArgs().then(value => launchArgs.value = value);

watchEffect(async () => {
    const launchTypeString = launchOption.value;
    const launchType = EnumResolver.from<LaunchType>(LaunchType, launchTypeString);
    determinedLaunchType.value = await getDeterminedLaunchType(activeGame.value, LaunchType[launchType]);
    wrapperProvided.value = await areWrapperArgumentsProvided(activeGame.value);
})

getLaunchType(activeGame.value)
    .then(launchType => launchOption.value = LaunchType[launchType]);

function closeModal() {
  LaunchTypeModalOpen.value = false;
}

async function updateAndClose() {
  const settings = await ManagerSettings.getSingleton(activeGame.value);
  await settings.setLaunchType(launchOption.value);
  closeModal();
}

</script>

<template>
    <ModalCard id="launch-type-modal" v-show="LaunchTypeModalOpen" :is-active="LaunchTypeModalOpen" :can-close="true" @close-modal="closeModal">
        <template v-slot:header>
            <h2 class="modal-title">
                {{ t('translations.pages.manager.modals.launchType.title') }}
            </h2>
        </template>
        <template v-slot:body>
          <div>
              <input id="launch-type-option-auto" type="radio" name="launch-type-option" :value="LaunchType.AUTO" v-model="launchOption"/>
              <label for="launch-type-option-auto"><span class="margin-right margin-right--half-width"/>
                {{ t('translations.enums.launchType.AUTO') }}
              </label>
          </div>
          <div>
              <input id="launch-type-option-native" type="radio" name="launch-type-option" :value="LaunchType.NATIVE" v-model="launchOption"/>
              <label for="launch-type-option-native"><span class="margin-right margin-right--half-width"/>
                {{ t('translations.enums.launchType.NATIVE') }}
              </label>
          </div>
          <div>
              <input id="launch-type-option-proton" type="radio" name="launch-type-option" :value="LaunchType.PROTON" v-model="launchOption"/>
              <label for="launch-type-option-proton"><span class="margin-right margin-right--half-width"/>
                {{ t('translations.enums.launchType.PROTON') }}
              </label>
          </div>
            <div class="notification margin-top" v-if="launchOption === LaunchType.AUTO">
                {{ t(`translations.pages.manager.modals.launchType.auto.${EnumResolver.from(LaunchType, determinedLaunchType)}`) }}
            </div>

          <div v-if="determinedLaunchType === LaunchType.NATIVE && !wrapperProvided" class="margin-top">
            <p>
              {{ t('translations.pages.manager.modals.launchType.native.unsureWrapperArgsPresent') }}
            </p>
            <p>
              {{ t('translations.pages.manager.modals.launchType.native.addArgumentsInfo') }}
            </p>
            <div>
              <code>
                {{ launchArgs }}
              </code>
            </div>
            <div class="margin-top">
              <CopyToClipboardButton :copy-value="launchArgs">
                {{ t('translations.pages.manager.modals.launchType.actions.copyLaunchArgs') }}
              </CopyToClipboardButton>
            </div>
          </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="updateAndClose">
                {{ t('translations.pages.manager.modals.launchType.actions.update') }}
            </button>
        </template>
    </ModalCard>
</template>
