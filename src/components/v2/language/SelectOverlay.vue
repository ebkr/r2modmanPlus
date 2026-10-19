<script lang="ts" setup>
import LocaleManager from '@r2/r2mm/manager/LocaleManager';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, availableLocales, messages } = useI18n();

const searchTerm = ref<string>("");

</script>

<template>
    <div class="search__holder">
        <input class="search-bar" placeholder="Language..." type="text" v-model="searchTerm"/>
    </div>
    <div class="light-separator"></div>
    <ul class="menu-list">
        <li v-for="lang in availableLocales" :key="`locale-select-${lang}`">
            <a v-close-popper @click="() => LocaleManager.save(lang)">
                <div class="locale-list__item">
                    <span class="locale-list__text">{{ lang }} ({{ t('metadata.name', 0, {locale: lang}) }})</span>
                    <span class="locale-list__divider"></span>
                    <span class="locale-list__tag tag is-warning" v-if="((messages[lang]?.metadata as any).wip || '').length > 0">{{ t('metadata.wip', 0, {locale: lang}) }}</span>
                </div>
            </a>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.menu-list {
    max-height: 150px;
    overflow-y: auto;
}

.light-separator {
    display: flex;
    margin-bottom: 5px;
}

.search-bar {
    background-color: transparent;
    padding: 0.5rem;
    border: 1px solid var(--input-placeholder-color);
    margin: 0.2rem;
    color: var(--v2-primary-text-color);
    border-radius: 5px;
}
</style>
