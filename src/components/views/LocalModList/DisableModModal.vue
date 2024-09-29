<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ModalCard } from '../../all';
import R2Error from '../../../model/errors/R2Error';
import ManifestV2 from '../../../model/ManifestV2';
import LoggerProvider, { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import Dependants from '../../../r2mm/mods/Dependants';

@Component({
    components: {ModalCard}
})
export default class DisableModModal extends Vue {

    modBeingDisabled: string | null = null;

    get dependants() {
        return Dependants.getDependantList(this.mod, this.$store.state.profile.modList);
    }

    get isLocked(): boolean {
        return this.modBeingDisabled !== null;
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isDisableModModalOpen
            && this.$store.state.modals.disableModModalMod !== null;
    }

    get mod(): ManifestV2 {
        if (this.$store.state.modals.disableModModalMod === null) {
            throw new R2Error(
                'Error while opening DisableModModal',
                'Mod not provided'
            );
        }
        return this.$store.state.modals.disableModModalMod;
    }

    async disableModIncludingDependants() {
        await this.disableMods([...this.dependants, this.mod]);
    }

    async disableModExcludingDependants() {
        await this.disableMods([this.mod]);
    }

    private async disableMods(mods: ManifestV2[]) {
        const onProgress = (mod: ManifestV2) => this.modBeingDisabled = mod.getName();

        try {
            await this.$store.dispatch(
                'profile/disableModsFromActiveProfile',
                { mods, onProgress }
            );
        } catch (e) {
            this.$store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        } finally {
            this.onClose();
            this.modBeingDisabled = null;
        }
    }

    onClose() {
        this.$store.commit('closeDisableModModal');
    }
}
</script>

<template>
    <ModalCard v-if="isOpen" :is-active="isOpen" :can-close="!isLocked" @close-modal="onClose">
        <template v-slot:header>
            <h2 class="modal-title">Disabling {{mod.getName()}}</h2>
        </template>
        <template v-slot:body>
            <div class="max-height-100 is-flex is-flex-direction-column">
                <div class='notification is-warning'>
                    <p>
                        Other mods depend on this mod. Select <strong>Disable all</strong>
                        to disable dependent mods, otherwise they may cause errors.
                    </p>
                </div>
                <h3 class="subtitle mb-3">Mods to be disabled</h3>
                <div class="is-flex-shrink-1 overflow-auto code-snippet">
                    <ul class="list">
                        <li class="list-item">{{mod.getName()}}</li>
                        <li class="list-item" v-for='(mod) in dependants'
                            :key='`dependant-${mod.getName()}`'>
                            {{mod.getName()}}
                        </li>
                    </ul>
                </div>
                <div v-if="isLocked" class="mt-3">
                    <h3 class="subtitle mb-3">Disabling {{modBeingDisabled}}</h3>
                    <progress class="progress is-small is-info"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="isLocked"
                    @click="disableModIncludingDependants">
                Disable all (recommended)
            </button>
            <button class="button"
                    :disabled="isLocked"
                    @click="disableModExcludingDependants">
                Disable {{mod.getName()}} only
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
