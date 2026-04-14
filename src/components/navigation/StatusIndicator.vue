<template>
    <div
        :class="['status-indicator', status.severity, { 'status-indicator--clickable': status.onClick }]"
        @click="status.onClick ? status.onClick() : undefined"
        v-tooltip.top="status.tooltip"
    >
        <i :class="['status-indicator__icon', status.iconClass]"></i>
        <span class="status-indicator__text">{{ status.text }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getStore } from '../../providers/generic/store/StoreProvider';
import { State } from '../../store';

const store = getStore<State>();

interface IndicatorStatus {
    text: string;
    iconClass: string;
    severity: 'info' | 'warning' | 'error';
    onClick?: () => Promise<void>;
    tooltip?: string;
}

const status = computed<IndicatorStatus>(() => {
    if (store.state.ecosystemUpdate.isInProgress) {
        return {
            text: "Updating game list...",
            iconClass: "fas fa-sync-alt fa-spin",
            severity: "info",
        };
    }

    if (store.getters['ecosystemUpdate/conciseEcosystemUpdateErrorMessage']) {
        return {
            text: store.getters['ecosystemUpdate/conciseEcosystemUpdateErrorMessage'],
            iconClass: "fas fa-exclamation-circle",
            severity: "error",
        };
    }

    if (store.getters['download/conciseDownloadStatus']) {
        return {
            text: store.getters['download/conciseDownloadStatus'],
            iconClass: "fas fa-cloud-download-alt",
            severity: "info",
        };
    }

    if (store.getters['tsMods/conciseThunderstoreModListUpdateErrorMessage']) {
        return {
            text: store.getters['tsMods/conciseThunderstoreModListUpdateErrorMessage'],
            iconClass: "fas fa-exclamation-circle",
            severity: "error",
            tooltip: "Refresh",
            onClick: () => store.dispatch('tsMods/syncPackageList'),
        };
    }

    if (store.state.tsMods.isThunderstoreModListUpdateInProgress) {
        return {
            text: "Refreshing online mod list...",
            iconClass: "fas fa-cloud-download-alt",
            severity: "info",
        };
    }

    if (store.getters['tsMods/isModListOutdated']) {
        return {
            text: "Outdated online mod list",
            iconClass: "fas fa-exclamation-triangle",
            severity: "warning",
            tooltip: "Refresh",
            onClick: () => store.dispatch('tsMods/syncPackageList'),
        };
    }

    return {
        text: "You have the latest game list",
        iconClass: "fas fa-check",
        severity: "info",
    };
});
</script>

<style lang="scss" scoped>
.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    line-height: 1;
    color: var(--text-secondary, #6b7280);
    white-space: nowrap;
    user-select: none;
}

.status-indicator--clickable {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.status-indicator__icon {
    font-size: 0.75rem;
}

.status-indicator.error {
    color: var(--notification-danger, #cc0f35);
}

.status-indicator.warning {
    color: var(--notification-warning, #946c00);
}
</style>
