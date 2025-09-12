<template>
    <keep-alive>
        <div>
            <div class='row-card is-shadowless' :class="[{'disabled-card': !enabled}, {'row-card--expanded': visible}]">
                <div @click='toggleVisibility()' class='cursor-pointer'>
                    <header class='card-header is-shadowless' :id='id'>
                        <div class='card-header-icon mod-logo' v-if="image !== ''">
                            <figure class='image is-48x48 image-parent'>
                                <img :src='image' :alt="t('translations.pages.manager.installed.expandableCard.imageAltText')" class='image-overlap'/>
                                <img v-if="store.state.profile.funkyMode" src='../assets/funky_mode.png' :alt="t('translations.pages.manager.installed.expandableCard.funkyModeAltText')" class='image-overlap'/>
                            </figure>
                        </div>
                        <span ref="title" class='card-header-title'><slot name='title'></slot></span>
                        <slot name='other-icons'></slot>
                        <!-- Allow movement of mod order -->
                        <a v-if='showSort' class='card-header-icon handle'>
                            <i class="fas fa-grip-vertical" :v-tooltip.left="t('translations.pages.manager.installed.expandableCard.tooltips.dragToReorder')"></i>
                        </a>
                        <a class='card-header-icon'>
                            <span class='icon'>
                                <i class='fas fa-angle-right' aria-hidden='true' v-if='!visible' v-tooltip.left="t('translations.pages.manager.installed.expandableCard.tooltips.expand')"></i>
                                <i class='fas fa-angle-down' aria-hidden='true' v-if='visible' v-tooltip.left="t('translations.pages.manager.installed.expandableCard.tooltips.collapse')"></i>
                            </span>
                        </a>
                    </header>
                </div>
                <div class='card-content' v-show='visible' v-if="description !== ''">
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
import { useI18n } from "vue-i18n";

const store = getStore<State>();
const { t } = useI18n();

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
    word-break: break-all;
}
</style>
