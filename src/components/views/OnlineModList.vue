<template>
    <div>
        <ExpandableCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}-${settings.getContext().global.expandedCards}`"
            :image="getImageUrl(key)"
            :id="`online-card-${index}`"
            :description="key.getDescription()">
            <template v-slot:title>
                <span v-if="key.isPinned()">
                    <span class="tag is-info margin-right margin-right--half-width"
                          v-tooltip.right="t('translations.pages.manager.online.modList.tooltips.pinned.long')">
                        {{ t('translations.pages.manager.online.modList.tooltips.pinned.short') }}
                    </span>
                    <span class="selectable">{{key.getName()}} <span class="card-byline">{{ t('translations.pages.manager.online.modList.mod.author', { author: key.getOwner() }) }}</span></span>
                </span>
                <span v-else-if="isModDeprecated(key)">
                    <span class="tag is-danger margin-right margin-right--half-width"
                          v-tooltip.right="t('translations.pages.manager.online.modList.tooltips.deprecated.long')">
                        {{ t('translations.pages.manager.online.modList.tooltips.deprecated.short') }}
                    </span>
                    <strike class="selectable">{{key.getName()}} <span class="card-byline">{{ t('translations.pages.manager.online.modList.mod.author', { author: key.getOwner() }) }}</span></strike>
                </span>
                <span v-else class='selectable'>
                    {{key.getName()}} <span class="card-byline">{{ t('translations.pages.manager.online.modList.mod.author', { author: key.getOwner() }) }}</span>
                </span>
            </template>
            <template v-slot:other-icons>
                <DonateIconButton :mod="key" :extraRenderCondition="!readOnly"/>
                <span class='card-header-icon' v-if="isThunderstoreModInstalled(key) && !readOnly">
                    <i class='fas fa-check' v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.installed')"></i>
                </span>
            </template>
            <template v-slot:description>
                <p class='card-timestamp'>
                  <i18n-t tag="strong" keypath="translations.pages.manager.online.previewPanel.metadata.lastUpdated">
                    <template v-slot:date>
                        <span class="font-weight-normal">
                            {{ d(key.getDateUpdated(), 'long', messages[locale].metadata.locale) }}
                        </span>
                    </template>
                  </i18n-t>
                </p>
                <p class='card-timestamp'>
                  <i18n-t tag="strong" keypath="translations.pages.manager.online.previewPanel.metadata.categories">
                    <template v-slot:categories>
                      <span class="font-weight-normal">{{ getReadableCategories(key) }}</span>
                    </template>
                  </i18n-t>
                </p>
            </template>
            <a class='card-footer-item' v-if="!readOnly" @click='showDownloadModal(key)'>
              {{ t('translations.pages.manager.online.modList.actions.download') }}
            </a>
            <ExternalLink :url="key.getPackageUrl()" class='card-footer-item'>
              {{ t('translations.pages.manager.online.modList.actions.website') }}
              <i class="fas fa-external-link-alt margin-left margin-left--half-width"></i>
            </ExternalLink>
            <template v-if="!readOnly">
                <DonateButton :mod="key"/>
            </template>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-download'/> {{key.getDownloadCount()}}</span>
            </div>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-thumbs-up'/> {{key.getRating()}}</span>
            </div>
        </ExpandableCard>

    </div>
</template>

<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import { ExpandableCard, ExternalLink } from '../all';
import ManifestV2 from '../../model/ManifestV2';
import DonateButton from '../../components/buttons/DonateButton.vue';
import DonateIconButton from '../../components/buttons/DonateIconButton.vue';
import CdnProvider from '../../providers/generic/connection/CdnProvider';
import { valueToReadableDate } from '../../utils/DateUtils';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { computed, onMounted, ref } from 'vue';
import {useI18n} from "vue-i18n";

const store = getStore<State>();
const { t, d, messages, locale } = useI18n();

type OnlineModListProps = {
    pagedModList: ThunderstoreMod[];
    readOnly: boolean;
}

const props = defineProps<OnlineModListProps>();

const cardExpanded = ref<boolean>(false);
const funkyMode = ref<boolean>(false);

const settings = computed<ManagerSettings>(() => store.getters["settings"]);
const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const deprecationMap = computed<Map<string, boolean>>(() => store.state.tsMods.deprecated);

function isModDeprecated(mod: ThunderstoreMod) {
    return deprecationMap.value.get(mod.getFullName()) || false;
}

function isThunderstoreModInstalled(mod: ThunderstoreMod) {
    return localModList.value.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
}

function showDownloadModal(mod: ThunderstoreMod) {
    store.commit("openDownloadModVersionSelectModal", mod);
}

function getReadableDate(date: Date): string {
    return valueToReadableDate(date);
}

function getReadableCategories(mod: ThunderstoreMod) {
    return mod.getCategories().join(", ");
}

function getImageUrl(mod: ThunderstoreMod): string {
    return CdnProvider.replaceCdnHost(mod.getIcon());
}

onMounted(() => {
    cardExpanded.value = settings.value.getContext().global.expandedCards;
    funkyMode.value = settings.value.getContext().global.funkyModeEnabled;
});

</script>

<style lang="scss" scoped>
.font-weight-normal {
  font-weight: normal;
}
</style>
