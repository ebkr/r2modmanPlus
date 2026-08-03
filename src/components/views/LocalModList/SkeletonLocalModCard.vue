<script lang="ts" setup>
import { ExpandableCard } from '../../all';
import ManifestV2 from '../../../model/ManifestV2';
import { useModIcon } from '../../composables/ModIconComposable';
import { useI18n } from 'vue-i18n';

type LocalModCardProps = {
    mod: ManifestV2;
}

const props = defineProps<LocalModCardProps>();

const { t } = useI18n();

const icon = useModIcon(() => props.mod);
</script>

<template>
    <ExpandableCard
        :description="mod.getDescription()"
        :enabled="mod.isEnabled()"
        :id="`${mod.getAuthorName()}-${mod.getName()}-${mod.getVersionNumber()}`"
        :image="icon">

        <template v-slot:title>
            <span class="non-selectable">
                <span v-if="!mod.isEnabled()"
                      class="tag is-warning margin-right margin-right--half-width"
                      v-tooltip.right="t('translations.pages.manager.installed.localModCard.tooltips.willNotBeUsed')">
                    {{ t('translations.pages.manager.installed.localModCard.labels.disabled') }}
                </span>
                <span class="card-title selectable">
                    <component :is="mod.isEnabled() ? 'span' : 'strike'" class="selectable">
                        {{mod.getDisplayName()}}
                        <span class="selectable card-byline">
                            v{{mod.getVersionNumber()}}
                        </span>
                        <span :class="`card-byline ${mod.isEnabled() && 'selectable'}`">
                            {{ t('translations.pages.manager.online.modList.mod.author', { author: mod.getAuthorName() }) }}
                        </span>
                    </component>
                </span>
            </span>
        </template>

        <template v-slot:description>
        </template>

        <!-- Show icon button row even when card is collapsed -->
        <template v-slot:other-icons>
        </template>
    </ExpandableCard>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
}
</style>
