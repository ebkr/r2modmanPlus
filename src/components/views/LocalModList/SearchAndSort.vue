<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { DeferredInput } from '../../all';
import GameManager from '../../../model/game/GameManager';
import { SortDirection } from '../../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../../model/real_enums/sort/SortNaming';
import ManagerSettings from '../../../r2mm/manager/ManagerSettings';

@Component({
    components: {
        DeferredInput,
    }
})
export default class SearchAndSort extends Vue {
    settings = new ManagerSettings();

    toggleSortingDirection() {
        this.direction = this.direction === SortDirection.STANDARD ? SortDirection.REVERSE : SortDirection.STANDARD;
    }

    get order() {
        return this.$store.state.profile.order;
    }

    set order(value: SortNaming) {
        this.$store.commit('profile/setOrder', value);
        this.settings.setInstalledSortBy(value);
    }

    get direction() {
        return this.$store.state.profile.direction;
    }

    set direction(value: SortDirection) {
        this.$store.commit('profile/setDirection', value);
        this.settings.setInstalledSortDirection(value);
    }

    get disabledPosition() {
        return this.$store.state.profile.disabledPosition;
    }

    set disabledPosition(value: SortLocalDisabledMods) {
        this.$store.commit('profile/setDisabledPosition', value);
        this.settings.setInstalledDisablePosition(value);
    }

    get search() {
        return this.$store.state.profile.searchQuery;
    }

    set search(value: string) {
        this.$store.commit('profile/setSearchQuery', value);
    }

    get orderOptions() {
        return Object.values(SortNaming);
    }

    get directionOptions() {
        return Object.values(SortDirection);
    }

    get disabledOptions() {
        return Object.values(SortLocalDisabledMods);
    }

    async created() {
        this.settings = await ManagerSettings.getSingleton(GameManager.activeGame);

        this.$store.commit('profile/initialize', [
            this.settings.getInstalledSortBy(),
            this.settings.getInstalledSortDirection(),
            this.settings.getInstalledDisablePosition()
        ]);
    }

    async destroyed() {
        this.$store.commit('profile/setSearchQuery', '');
    }
}
</script>

<template>
    <div class="inherit-background-colour sticky-top sticky-top--search non-selectable">
        <div class="is-shadowless is-square">
            <div class="no-padding-left card-header-title">

                <div class="input-group input-group--flex margin-right">
                    <label for="local-search" class="non-selectable">Search</label>
                    <DeferredInput
                        v-model="search"
                        id="local-search"
                        class="input margin-right"
                        type="text"
                        placeholder="Search for an installed mod"
                    />
                </div>

                <div class="input-group margin-right">
                    <label for="local-sort-order" class="non-selectable">Sort</label>
                    <div class="sort-container"> <!-- This div wraps the selector and the icon -->
                        <select
                            v-model="order"
                            id="local-sort-order"
                            class="select select--content-spacing margin-right margin-right--half-width">
                            <option v-for="(option) in orderOptions" :key="`order-option-${option}`">
                                {{ option }}
                            </option>
                        </select>
                        <div class="icon-container" @click="toggleSortingDirection" :style="{ cursor: 'pointer' }"> <!-- New div to center the icon vertically -->
                            <i :class="['fas', 'fa-caret-up', 'sorting-icon', { 'rotated': direction === 'Reverse' }]" class="icon--margin-right"></i>
                        </div>
                    </div>
                </div>

                <div class="input-group">
                    <label for="local-deprecated-position" class="non-selectable">Disabled</label>
                    <select
                        v-model="disabledPosition"
                        id="local-deprecated-position"
                        class="select select--content-spacing">
                        <option v-for="(option) in disabledOptions" :key="`disabled-option-${option}`">
                            {{option}}
                        </option>
                    </select>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
