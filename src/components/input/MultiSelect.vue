<template>
    <div>
        <div>
            <select class="select select--full" @change="updateSelection">
                <option selected disabled>
                    {{ placeholder }}
                </option>
                <option v-for="(entry, index) in selectableOptions" :value="entry" :selected="false">{{ entry }}</option>
            </select>
        </div>
        <div class="tags has-addons margin-top" v-if="visibleSelectedOptions.length > 0">
            <span class="margin-right" v-for="option in visibleSelectedOptions">
                <a href="#" @click="removeSelection(option)">
                    <div class="tag has-addons">
                        <span>{{ option }}</span>
                    </div>
                    <span class="tag is-delete is-danger">&nbsp;</span>
                </a>
            </span>
        </div>
        <div class="margin-top"></div>
    </div>
</template>

<script lang="ts" setup>

import { computed } from 'vue';

export type MultiSelectProps = {
    placeholder: string,
    selected: string[],
    options: string[],
}

const props = defineProps<MultiSelectProps>();
const emits = defineEmits<{
    (e: 'selection-changed', selection: string[]): void
}>();

const selectableOptions = computed(() => {
    return props.options
        .filter(entry => props.selected.findIndex(value => value.trim() === entry.trim()) === -1)
});

const visibleSelectedOptions = computed(() => {
    return props.selected.filter(value => value.trim().length > 0);
})

function updateSelection(event: InputEvent) {
    const target = event.target as HTMLSelectElement;
    emits('selection-changed', [...props.selected, target.value]);
    target.selectedIndex = 0;
}

function removeSelection(item: string) {
    const selected = [...props.selected];
    const selectedIndex = selected.indexOf(item);
    if (selectedIndex >= 0) {
        selected.splice(selectedIndex, 1);
    }
    emits('selection-changed', [...selected]);
}

</script>
