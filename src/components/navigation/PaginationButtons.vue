<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { truncatePagination } from "../../utils/Pagination";

@Component({})
export default class PaginationButtons extends Vue {
    @Prop({ required: true })
    private currentPage!: number;

    @Prop({ required: true })
    private pageCount!: number;

    @Prop({ required: true })
    private contextSize!: number;

    @Prop({ required: true })
    private onClick!: (pageIndex: number) => void;

    @Watch("currentPage")
    @Watch("pageCount")
    @Watch("contextSize")
    visibleButtons() {
        return truncatePagination({
            currentPage: this.currentPage,
            pageCount: this.pageCount,
            contextSize: this.contextSize,
        });
    }
}
</script>

<template>
<nav class="pagination">
    <ul class="pagination-list">
        <li
            v-for="button in visibleButtons()"
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
