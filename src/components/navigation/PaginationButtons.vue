<script lang="ts" setup>
import { truncatePagination } from '../../utils/Pagination';
import { computed } from 'vue';

type PaginationButtonsProps = {
    currentPage: number;
    pageCount: number;
    contextSize: number;
    onClick: (pageIndex: number) => void;
}

const props = defineProps<PaginationButtonsProps>();

const visibleButtons = computed(() => {
    return truncatePagination({
        currentPage: props.currentPage,
        pageCount: props.pageCount,
        contextSize: props.contextSize,
    });
});
</script>

<template>
<nav class="pagination">
    <ul class="pagination-list">
        <li
            v-for="button in visibleButtons"
            :key="`pagination-${button.index}`"
        >
            <a
                :class="[
                    'pagination-link',
                    'flex-centered',
                    {'is-current': button.index === currentPage}
                ]"
                @click="onClick(button.index)"
            >{{button.title}}</a>
        </li>
    </ul>
</nav>
</template>

<style scoped lang="scss">
.flex-centered {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
