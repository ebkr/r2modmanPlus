<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import ModalCard from '../../components/ModalCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import GameInstructions from '../../r2mm/launching/instructions/GameInstructions';
import GameRunnerProvider from '../../providers/generic/game/GameRunnerProvider';
import GameInstructionParser from '../../r2mm/launching/instructions/GameInstructionParser';
import R2Error from '../../model/errors/R2Error';

const store = getStore<State>();

const isOpen = computed(() => store.state.modals.isLaunchArgumentsModalOpen);

const activeGame = computed(() => store.state.activeGame);
const profile = computed(() => store.getters['profile/activeProfile']);

const settings = ref<ManagerSettings | null>(null);
const launchArguments = ref<string>('');
const doorstopTarget = ref<string>('');
const vanillaLaunchArgs = ref<string>('');

async function load() {
    settings.value = await ManagerSettings.getSingleton(activeGame.value);
    launchArguments.value = settings.value.getContext().gameSpecific.launchParameters;

    GameInstructions.getInstructionsForGame(activeGame.value, profile.value).then(instructions => {
        vanillaLaunchArgs.value = instructions.vanillaParameterList.map(value => `"${value}"`).join(' ');
    });

    GameRunnerProvider.instance.getGameArguments(activeGame.value, profile.value).then(target => {
        if (target instanceof R2Error) {
            doorstopTarget.value = '';
        } else {
            GameInstructionParser.parseList(target, activeGame.value, profile.value).then(instructions => {
                if (instructions instanceof R2Error) {
                    throw instructions;
                }
                doorstopTarget.value = instructions.map(value => `"${value}"`).join(' ');
            });
        }
    });
}

watch(isOpen, (open) => {
    if (open) {
        load();
    }
});

async function updateLaunchArguments() {
    if (settings.value) {
        await settings.value.setLaunchParameters(launchArguments.value);
    }
    close();
}

function close() {
    store.commit('closeLaunchArgumentsModal');
}
</script>

<template>
    <ModalCard id="launch-arguments-modal" v-show="isOpen" :is-active="isOpen" @close-modal="close">
        <template v-slot:header>
            <h2 class="modal-title">Set custom launch arguments</h2>
        </template>
        <template v-slot:body>
            <p>Some arguments are provided by default:</p>
            <br/>
            <p>Modded:
                <br/>
                <code v-if="doorstopTarget.length > 0">{{ doorstopTarget }}</code>
                <code v-else>These arguments will be available after installing a mod loader.</code>
            </p>
            <br/>
            <p>Vanilla:
                <br/>
                <code>{{ vanillaLaunchArgs }}</code>
            </p>
            <br/>
            <p>
                <strong>Please note that these are called against the Steam executable. Be careful when
                    entering custom launch arguments.</strong>
            </p>
            <br/>
            <input
                v-model="launchArguments"
                id="launch-arguments-modal-input"
                class="input"
                placeholder="Enter arguments"
                autocomplete="off"
            />
        </template>
        <template v-slot:footer>
            <button class="button is-info" @click="updateLaunchArguments">
                Update launch arguments
            </button>
        </template>
    </ModalCard>
</template>
