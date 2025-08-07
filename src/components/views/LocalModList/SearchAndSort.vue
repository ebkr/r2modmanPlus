<script lang="ts" setup>
import { SortDirection } from '../../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../../model/real_enums/sort/SortNaming';
import { getStore } from '../../../providers/generic/store/StoreProvider';
import { State } from '../../../store';
import { computed } from 'vue';
import DeferredInput from '../../DeferredInput.vue';
import { useI18n } from 'vue-i18n';
import EnumResolver from '../../../model/enums/_EnumResolver';

const store = getStore<State>();
const { t } = useI18n();

const order = computed({
    get() {
        return store.state.profile.order;
    },
    set(newValue: SortNaming) {
        store.dispatch('profile/updateOrder', newValue);
    }
});

const direction = computed({
    get() {
        return store.state.profile.direction;
    },
    set(newValue: SortDirection) {
        store.dispatch('profile/updateDirection', newValue);
    }
});

const disabledPosition = computed({
    get() {
        return store.state.profile.disabledPosition;
    },
    set(newValue: SortLocalDisabledMods) {
        store.dispatch('profile/updateDisabledPosition', newValue);
    }
});

const search = computed({
    get() {
        return store.state.profile.searchQuery;
    },
    set(newValue: string) {
        store.commit('profile/setSearchQuery', newValue);
    }
});

const orderOptions = computed(() => Object.values(SortNaming));
const directionOptions = computed(() => Object.values(SortDirection));
const disabledOptions = computed(() => Object.values(SortLocalDisabledMods));
</script>

<template>
    <div class="inherit-background-colour sticky-top sticky-top--search non-selectable">
        <div class="is-shadowless is-square">
            <div class="no-padding-left card-header-title">

                <div class="input-group input-group--flex margin-right">
                    <label for="installed-search" class="non-selectable">
                        {{ t('translations.pages.manager.installed.searchAndSort.search.label') }}
                    </label>
                    <DeferredInput
                        :modelValue="search"
                        @update:modelValue="$event => (search = $event)"
                        id="installed-search"
                        class="input margin-right"
                        type="text"
                        :placeholder="t('translations.pages.manager.installed.searchAndSort.search.placeholder')"
                        autocomplete="off"
                    />
                </div>

                <div class="input-group margin-right">
                    <label for="local-sort-order" class="non-selectable">
                        {{ t('translations.pages.manager.installed.searchAndSort.sort.label') }}
                    </label>
                    <select
                        v-model="order"
                        id="local-sort-order"
                        class="select select--content-spacing margin-right margin-right--half-width">
                        <option v-for="(option) in orderOptions" :key="`order-option-${option}`">
                            {{ t(`translations.pages.manager.installed.searchAndSort.sort.order.options.${EnumResolver.from(SortNaming, option)}`) }}
                        </option>
                    </select>
                    <select
                        v-model="direction"
                        id="local-sort-direction"
                        class="select select--content-spacing">
                        <option v-for="(option) in directionOptions" :key="`direction-option-${option}`">
                            {{ t(`translations.pages.manager.installed.searchAndSort.sort.directions.options.${EnumResolver.from(SortDirection, option)}`) }}
                        </option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="local-deprecated-position" class="non-selectable">
                        {{ t('translations.pages.manager.installed.searchAndSort.sort.disabledPositions.label') }}
                    </label>
                    <select
                        v-model="disabledPosition"
                        id="local-deprecated-position"
                        class="select select--content-spacing">
                        <option v-for="(option) in disabledOptions" :key="`disabled-option-${option}`">
                            {{ t(`translations.pages.manager.installed.searchAndSort.sort.disabledPositions.options.${EnumResolver.from(SortLocalDisabledMods, option)}`) }}
                        </option>
                    </select>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
