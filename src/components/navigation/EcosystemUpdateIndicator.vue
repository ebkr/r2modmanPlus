<template>
    <Teleport to="#activity-bar__right">
        <div v-if="status.onClick">
            <button
                type="button"
                :class="['activity-bar__action', 'status-indicator', { 'status-indicator--error-action': status.isError }]"
                :title="status.tooltip"
                @click="status.onClick"
            >
                <i :class="status.iconClass"></i>
                <span class="status-indicator__text">{{ status.text }}</span>
            </button>
        </div>
        <div
            v-else
            :class="['status-indicator', { 'status-indicator--error': status.isError }]"
        >
            <i :class="status.iconClass"></i>
            <span class="status-indicator__text">{{ status.text }}</span>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';
import { useI18n } from 'vue-i18n';

const store = getStore<State>();

const { t } = useI18n();

function retryEcosystemUpdate() {
    store.dispatch('ecosystemUpdate/updateEcosystemSchema');
}

const status = computed(() => {
    if (store.state.ecosystemUpdate.isInProgress) {
        return {
            text: t('translations.pages.gameSelection.ecosystemUpdate.updating'),
            iconClass: "fas fa-sync-alt fa-spin",
            isError: false,
            onClick: undefined,
            tooltip: undefined,
        };
    }

    const errorMessage = store.getters['ecosystemUpdate/conciseEcosystemUpdateErrorMessage'];
    if (errorMessage !== undefined) {
        return {

            text: errorMessage || t('translations.pages.gameSelection.ecosystemUpdate.failed'),
            iconClass: "fas fa-exclamation-circle",
            isError: true,
            onClick: retryEcosystemUpdate,
            tooltip: t('translations.pages.gameSelection.ecosystemUpdate.retry'),
        };
    }

    return {
        text: t('translations.pages.gameSelection.ecosystemUpdate.upToDate'),
        iconClass: "fas fa-check",
        isError: false,
        onClick: undefined,
        tooltip: undefined,
    };
});
</script>

<style lang="scss" scoped>
.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--text-secondary, #6b7280);
    white-space: nowrap;
    user-select: none;
    margin-left: auto;
}

.status-indicator__text {
    padding: 0.4rem 0;
    font-size: 0.875rem;
    line-height: 1.5;
}

.activity-bar__action .status-indicator__text {
    padding: 0;
}

.status-indicator--error-action {
    color: var(--ecosystem-update-error-text, #a3162f);
    background: var(--ecosystem-update-error-background, #fbe4e7);
    border: 1px solid var(--ecosystem-update-error-border, #efc2ca);
}

.status-indicator--error-action:hover {
    background: var(--ecosystem-update-error-background, #fbe4e7);
    border-color: var(--ecosystem-update-error-border, #efc2ca);
    color: var(--ecosystem-update-error-text, #a3162f);
}

.spacer {
    flex: 1;
}
</style>
