<template>
    <span v-if="mod && mod.getDonationLink() && extraRenderCondition" class="card-header-icon">
        <ExternalLink :url="mod.getDonationLink()!" tag="span">
            <i class="fas fa-heart" v-tooltip.left="t('translations.pages.manager.online.modList.tooltips.donate')"></i>
        </ExternalLink>
    </span>
</template>

<script lang="ts" setup>
import ThunderstoreMod from '../../model/ThunderstoreMod';
import { ExternalLink }  from '../../components/all';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type DonateIconButtonProps = {
    mod: ThunderstoreMod;
    extraRenderCondition?: boolean;
}

withDefaults(defineProps<DonateIconButtonProps>(), {
    extraRenderCondition: true
});
</script>
