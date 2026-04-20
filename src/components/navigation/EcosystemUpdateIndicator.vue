<template>
    <Teleport to="#activity-bar">
        <div :class="['status-indicator', { 'status-indicator--error': status.isError }]">
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

const status = computed(() => {
    if (store.state.ecosystemUpdate.isInProgress) {
        return {
            text: "Updating game list",
            iconClass: "fas fa-sync-alt fa-spin",
            isError: false,
        };
    }

    const errorMessage = store.getters['ecosystemUpdate/conciseEcosystemUpdateErrorMessage'];
    if (errorMessage) {
        return {
            text: errorMessage,
            iconClass: "fas fa-exclamation-circle",
            isError: true,
        };
    }

    return {
        text: "You have the latest game list",
        iconClass: "fas fa-check",
        isError: false,
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

.status-indicator--error {
    color: var(--notification-danger, #cc0f35);
}
</style>
