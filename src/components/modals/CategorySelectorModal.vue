<script lang="ts" setup>

type CategorySelectorModalProps = {
    title: string;
    selectedCategories: string[];
    selectableCategories: string[];
}

const props = defineProps<CategorySelectorModalProps>();
const emits = defineEmits<{
    'selected-category': [ev: Event];
    'deselectedCategory': [value: string];
}>();

function emitSelected(event: Event) {
    emits('selected-category', event)
}

function emitDeselected(key: string) {
    emits("deselected-category", key);
}
</script>

<template>
    <div class="input-group">
        <label>{{ title }}:</label>
        <div class="input-group margin-bottom">
            <select class="select select--content-spacing" @change="emitSelected">
                <option selected disabled>
                    Select a category
                </option>
                <option v-for="(key, index) in selectableCategories" :key="`category--${key}-${index}`">
                    {{ key }}
                </option>
            </select>
        </div>
        <div class="tags has-addons" v-if="selectedCategories.length > 0">
            <span class="margin-right" v-for="(key, index) in selectedCategories" :key="`${key}-${index}`">
                <a href="#" @click="emitDeselected(key)">
                    <div class="tag has-addons">
                        <span>{{ key }}</span>
                    </div>
                    <span class="tag is-delete is-danger">&nbsp;</span>
                </a>
            </span>
        </div>
        <div class="field has-addons" v-else>
            <span class="tags">
                <span class="tag">No categories selected</span>
            </span>
        </div>
    </div>
</template>
