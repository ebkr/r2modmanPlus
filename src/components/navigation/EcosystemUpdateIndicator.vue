<template>
    <Teleport to="#activity-bar">
        <button
            v-if="status.onClick"
            type="button"
            :class="['activity-bar__action', 'status-indicator', { 'status-indicator--error-action': status.isError }]"
            :title="status.tooltip"
            @click="status.onClick"
        >
            <i :class="status.iconClass"></i>
            <span class="status-indicator__text">{{ status.text }}</span>
        </button>
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

const store = getStore<State>();

function retryEcosystemUpdate() {
    store.dispatch('ecosystemUpdate/updateEcosystemSchema');
}

const status = computed(() => {
    if (store.state.ecosystemUpdate.isInProgress) {
        return {
            text: "Updating game list",
            iconClass: "fas fa-sync-alt fa-spin",
            isError: false,
            onClick: undefined,
            tooltip: undefined,
        };
    }

    const errorMessage = store.getters['ecosystemUpdate/conciseEcosystemUpdateErrorMessage'];
    if (errorMessage) {
        return {
            text: errorMessage,
            iconClass: "fas fa-exclamation-circle",
            isError: true,
            onClick: retryEcosystemUpdate,
            tooltip: "Retry game list update",
        };
    }

    return {
        text: "You have the latest game list",
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
    margin-left: auto;
    color: var(--ecosystem-update-error-text, #a3162f);
    background: var(--ecosystem-update-error-background, #fbe4e7);
    border: 1px solid var(--ecosystem-update-error-border, #efc2ca);
}

.status-indicator--error-action:hover {
    background: var(--ecosystem-update-error-background, #fbe4e7);
    border-color: var(--ecosystem-update-error-border, #efc2ca);
    color: var(--ecosystem-update-error-text, #a3162f);
}
</style>
