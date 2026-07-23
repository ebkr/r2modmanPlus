<template>
    <keep-alive>
        <div class='row-card is-shadowless' :class="[{'row-card--expanded': isSelected}]">
            <div class='cursor-pointer'>
                <header class='card-header is-shadowless' :id='id'>
                    <div class='card-header-icon mod-logo' v-if="image !== ''">
                        <figure class='image image-parent'>
                            <img :src='image' alt='Mod Logo' class='image-overlap'/>
                            <img v-if="store.state.profile.funkyMode" src='../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
                        </figure>
                    </div>
                    <span ref="title" class='card-header-title'>
                        <div>
                            <span class="selectable">{{mod.getName()}} <span class="card-byline">by {{mod.getOwner()}}</span></span>
                             <p class="description">{{mod.getDescription()}}</p>
                            <div class="category-tags">
                                <span class="category-tag" v-for="category in visibleCategories">{{ category }}</span>
                                <a href="#" class="category-link" @click.stop.prevent="toggleShowMoreCategories" v-if="mod.getCategories().length > 3">
                                    <template v-if="!showingMoreCategories">
                                        + More
                                    </template>
                                    <template v-else>
                                        Hide
                                    </template>
                                </a>
                            </div>
                        </div>
                    </span>
                    <span class='card-header-icon' v-if="isModDeprecated(mod)">
                        <i class='fas fa-exclamation-triangle' v-tooltip.left="'This mod is potentially broken'"></i>
                    </span>
                    <span class='card-header-icon' v-if="mod.isPinned() && !readOnly">
                        <i class='fas fa-map-pin' v-tooltip.left="'Pinned on Thunderstore'"></i>
                    </span>
                    <span class='card-header-icon' v-if="mod.getDonationLink() && !readOnly">
                        <ExternalLink :url="mod.getDonationLink()!" target="external" tag="span">
                            <i class='fas fa-heart' v-tooltip.left="'Donate to the mod author'"></i>
                        </ExternalLink>
                    </span>
                    <span class='card-header-icon' v-if="isThunderstoreModInstalled(mod) && !readOnly">
                        <i class='fas fa-check' v-tooltip.left="'Mod already installed'"></i>
                    </span>
                    <span class='card-header-icon' v-if="mod.getNsfwFlag()">
                        <i class="fas fa-pause-circle" v-tooltip.left="'Mod marked as NSFW'"></i>
                    </span>
                </header>
            </div>
        </div>
    </keep-alive>
</template>

<script lang='ts' setup>
import { onMounted, computed, ref } from 'vue';
import { getStore } from '../providers/generic/store/StoreProvider';
import { State } from '../store';
import { ExternalLink } from '../components/all';

const store = getStore<State>();

type OnlineRowCardProps = {
    isSelected: boolean;
    image: string;
    id: string;
    mod: ThunderstoreMod;
}

const props = defineProps<OnlineRowCardProps>();

const localModList = computed<ManifestV2[]>(() => store.state.profile.modList);
const deprecationMap = computed<Map<string, boolean>>(() => store.state.tsMods.deprecated);
const visibleCategories = computed<string[]>(() => {
    const categories = props.mod.getCategories();
    return showingMoreCategories.value
        ? categories
        : categories.slice(0, 3);
})

const showingMoreCategories = ref<boolean>(false);

function toggleShowMoreCategories() {
    showingMoreCategories.value = !showingMoreCategories.value;
}

function isModDeprecated(mod: ThunderstoreMod) {
    return deprecationMap.value.get(mod.getFullName()) || false;
}

function isThunderstoreModInstalled(mod: ThunderstoreMod) {
    return localModList.value.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
}

onMounted(async () => {
    await store.dispatch('profile/loadModCardSettings');
});
</script>


<style lang="scss" scoped>
.card-header-title {
    word-break: auto-phrase;
}

.image {
    width: 86px;
    height: 86px;
    margin-top: 0.25rem;
}

.category-tags {

    margin-top: 0.1rem;
    overflow-x: hidden;

    .category-tag {
        display: inline-block;
        border-radius: 5px;
        background-color: var(--v2-table-row-border-color);
        border: 1px solid var(--v2-table-row-border-color);
        padding: 0.1rem 0.5rem;
        font-weight: lighter;
        font-size: 0.7rem;
        margin-right: 0.25rem;
        white-space: nowrap;
    }

    .category-link {
        font-weight: lighter;
        font-size: 0.75rem;
        white-space: nowrap;
    }

}

.description {
    font-size: 0.85rem;
    font-weight: normal;
    color: var(--v2-secondary-text-color);
    margin-bottom: 0.2rem;
}
</style>
