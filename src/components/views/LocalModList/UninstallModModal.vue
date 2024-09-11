<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ModalCard } from '../../all';
import R2Error from '../../../model/errors/R2Error';
import ManifestV2 from '../../../model/ManifestV2';
import { LogSeverity } from '../../../providers/ror2/logging/LoggerProvider';
import Dependants from '../../../r2mm/mods/Dependants';

@Component({
    components: {ModalCard}
})
export default class UninstallModModal extends Vue {
    modBeingUninstalled: string | null = null;

    get dependants() {
        return Dependants.getDependantList(this.mod, this.$store.state.profile.modList);
    }

    get isLocked(): boolean {
        return this.modBeingUninstalled !== null;
    }

    get isOpen(): boolean {
        return this.$store.state.modals.isUninstallModModalOpen
            && this.$store.state.modals.uninstallModModalMod !== null;
    }

    get mod(): ManifestV2 {
        if (this.$store.state.modals.uninstallModModalMod === null) {
            throw new R2Error(
                'Error while opening UninstallModModal',
                'Mod not provided'
            );
        }
        return this.$store.state.modals.uninstallModModalMod;
    }

    async uninstallModIncludingDependants() {
        await this.uninstallMods([...this.dependants, this.mod]);
    }

    async uninstallModExcludingDependants() {
        await this.uninstallMods([this.mod]);
    }

    private async uninstallMods(mods: ManifestV2[]) {
        const onProgress = (mod: ManifestV2) => this.modBeingUninstalled = mod.getName();
        try {
            await this.$store.dispatch(
                'profile/uninstallModsFromActiveProfile',
                { mods, onProgress }
            );
        } catch (e) {
            this.$store.commit('error/handleError', {
                error: R2Error.fromThrownValue(e),
                severity: LogSeverity.ACTION_STOPPED
            });
        } finally {
            this.onClose();
            this.modBeingUninstalled = null;
        }
    }

    onClose() {
        this.$store.commit('closeUninstallModModal');
    }
}
</script>
<template>
    <ModalCard v-if="isOpen" :is-active="true" :can-close="!isLocked" @close-modal="onClose">
        <template v-slot:header>
            <h2 class='modal-title'>Uninstalling {{mod.getName()}}</h2>
        </template>
        <template v-slot:body>
            <div class="max-height-100 is-flex is-flex-direction-column">
                <div class='notification is-warning'>
                    <p>
                        Other mods depend on this mod. Select <strong>Uninstall all</strong>
                        to uninstall dependent mods, otherwise they may cause errors.
                    </p>
                </div>
                <h3 class="subtitle mb-3">Mods to be uninstalled</h3>
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
                    <h3 class="subtitle mb-3">Uninstalling {{modBeingUninstalled}}</h3>
                    <progress class="progress is-small is-info"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button class="button is-info"
                    :disabled="isLocked"
                    @click="uninstallModIncludingDependants">
                Uninstall all (recommended)
            </button>
            <button class="button"
                    :disabled="isLocked"
                    @click="uninstallModExcludingDependants">
                Uninstall {{mod.getDisplayName()}} only
            </button>
        </template>
    </ModalCard>
</template>

<style scoped lang="scss">

</style>
