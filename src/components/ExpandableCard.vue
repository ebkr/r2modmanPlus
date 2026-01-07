<template>
    <keep-alive>
        <div>
            <div class='row-card is-shadowless' :class="[{'disabled-card': !enabled}, {'row-card--expanded': visible}]">
                <div @click='toggleVisibility()' class='cursor-pointer'>
                    <header class='card-header is-shadowless' :id='id'>
                        <div class='card-header-icon mod-logo' v-if="image !== ''">
                            <figure class='image is-48x48 image-parent'>
                                <img :src='image' alt='Mod Logo' class='image-overlap'/>
                                <img v-if="store.state.profile.funkyMode" :src='ProtocolProvider.getPublicAssetUrl("/funky_mode.png")' alt='Funky mode' class='image-overlap'/>
                            </figure>
                        </div>
                        <span ref="title" class='card-header-title expandable-card__title'>
                            <slot name='title'></slot>
                        </span>
                        <slot name='other-icons'></slot>
                        <!-- Allow movement of mod order -->
                        <a v-if='showSort' class='card-header-icon handle'>
                            <i class="fas fa-grip-vertical" v-tooltip.left="'Drag to reorder'"></i>
                        </a>
                        <a class='card-header-icon'>
                            <span class='icon'>
                                <i class='fas fa-angle-right' aria-hidden='true' v-if='!visible' v-tooltip.left="'Expand'"></i>
                                <i class='fas fa-angle-down' aria-hidden='true' v-if='visible' v-tooltip.left="'Collapse'"></i>
                            </span>
                        </a>
                    </header>
                </div>
                <div class='mod-card-content' v-show='visible' v-if="description !== ''">
                    <div class='content'>
                        <p ref="description">{{description}}</p>
                        <slot name='description'></slot>
                    </div>
                </div>
                <footer class='card-footer card-footer-borderless' v-show='visible' ref="footer">
                    <slot></slot>
                    <div class="is-divider"></div>
                </footer>
            </div>
        </div>
    </keep-alive>
</template>

<script lang='ts' setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import ProtocolProvider from '../providers/generic/protocol/ProtocolProvider';

const store = getStore<State>();

type ExpandableCardProps = {
    image?: string;
    description?: string;
    id: string;
    allowSorting?: boolean;
    enabled?: boolean;
}

const props = withDefaults(defineProps<ExpandableCardProps>(), {
    image: '',
    description: '',
    allowSorting: false,
    enabled: true,
})

const visible = ref<boolean>(false);

const showSort = computed<boolean>(() => props.allowSorting && store.getters["profile/canSortMods"]);

watchEffect(() => {
    visible.value = store.state.profile.expandedByDefault;
})

function toggleVisibility() {
    visible.value = !visible.value;
}

onMounted(async () => {
    await store.dispatch('profile/loadModCardSettings');
    visible.value = store.state.profile.expandedByDefault;
});
</script>

<style lang="scss" scoped>
.card-header-title {
    word-break: auto-phrase;
}

.mod-card-content {
    padding: 0.5em 1rem;
}

.card-footer {
    padding-left: 0.5rem;
}
</style>
