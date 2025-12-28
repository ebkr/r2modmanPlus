<template>
    <div>
        <OnlineRowCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}`"
            :image="getImageUrl(key)"
            :id="`online-row-card-${index}`"
            :is-selected="selectedMod === key"
            @click="() => emitCardClick(key)">
            <template v-slot:title>
                <div>
                    <span class="selectable">{{key.getName()}}</span>
                    <div>
                        <span class="card-byline">{{key.getOwner()}}</span>
                    </div>
                </div>
            </template>
            <template v-slot:other-icons>
                <span class='card-header-icon' v-if="isModDeprecated(key)">
                    <i class='fas fa-exclamation-triangle' v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.deprecated.long')"></i>
                </span>
                <span class='card-header-icon' v-if="key.isPinned() && !readOnly">
                    <i class='fas fa-map-pin' v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.pinned.long')"></i>
                </span>
                <span class='card-header-icon' v-if="key.getDonationLink() && !readOnly">
                    <ExternalLink :url="key.getDonationLink()" target="external" tag="span">
                        <i class='fas fa-heart' v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.donate')"></i>
                    </ExternalLink>
                </span>
                <span class='card-header-icon' v-if="isThunderstoreModInstalled(key) && !readOnly">
                    <i class='fas fa-check' v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.installed')"></i>
                </span>
            </template>
        </OnlineRowCard>
    </div>
</template>

<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExternalLink } from '../all';
import ManifestV2 from '../../model/ManifestV2';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import OnlineRowCard from '../OnlineRowCard.vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed } from 'vue';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

type OnlineModListWithPanelProps = {
    pagedModList?: ThunderstoreMod[];
    selectedMod?: ThunderstoreMod | null;
    readOnly?: boolean;
}

const props = withDefaults(defineProps<OnlineModListWithPanelProps>(), {
    pagedModList: [],
    selectedMod: null,
    readOnly: false,
});

const emits = defineEmits<{
    (e: 'selected-mod', mod: ThunderstoreMod): void;
}>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const deprecationMap = computed<Map<string, boolean>>(() => store.state.tsMods.deprecated);

function isModDeprecated(mod: ThunderstoreMod) {
    return deprecationMap.value.get(mod.getFullName()) || false;
}

function isThunderstoreModInstalled(mod: ThunderstoreMod) {
    return localModList.value.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
}

function getImageUrl(mod: ThunderstoreMod): string {
    return CdnProvider.replaceCdnHost(mod.getIcon());
}

function emitCardClick(mod: ThunderstoreMod) {
    emits("selected-mod", mod);
}

</script>
