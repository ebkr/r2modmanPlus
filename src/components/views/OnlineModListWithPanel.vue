<template>
    <div id="online-cards">
        <OnlineRowCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}`"
            :image="getImageUrl(key)"
            :id="`online-row-card-${index}`"
            :is-selected="selectedMod === key"
            :mod="key"
            @click="() => emitCardClick(key)">
        </OnlineRowCard>
    </div>
</template>

<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ManifestV2 from '../../model/ManifestV2';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import OnlineRowCard from '../OnlineRowCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed } from 'vue';

const store = getStore<State>();

type OnlineModListWithPanelProps = {
    pagedModList?: ThunderstoreMod[];
    selectedMod?: ThunderstoreMod | null;
    readOnly?: boolean;
}

const props = withDefaults(defineProps<OnlineModListWithPanelProps>(), {
    pagedModList: () => [],
    selectedMod: null,
    readOnly: false,
});

const emits = defineEmits<{
    (e: 'selected-mod', mod: ThunderstoreMod): void;
}>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const deprecationMap = computed<Map<string, boolean>>(() => store.state.tsMods.deprecated);

function getImageUrl(mod: ThunderstoreMod): string {
    return CdnProvider.replaceCdnHost(mod.getIcon());
}

function emitCardClick(mod: ThunderstoreMod) {
    emits("selected-mod", mod);
}

</script>

<style scoped lang="scss">
#online-cards {
    min-width: min-content;
}
</style>
