import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import { useI18n } from 'vue-i18n';

import SearchUtils from '../../utils/SearchUtils';

export type SettingSearchPhrases = MaybeRefOrGetter<(string | undefined | null)[]>;

function isNonEmptyPhrase(phrase: string | undefined | null): phrase is string {
    return phrase !== null && phrase !== undefined && phrase !== '';
}

export function useSettingSearch(
    searchTerm: MaybeRefOrGetter<string | undefined>,
    termsKey: string,
    extraPhrases?: SettingSearchPhrases
): { isVisible: ComputedRef<boolean> } {
    const { tm, rt } = useI18n();

    const localisedPhrases = computed<string[]>(() => {
        const phrases = tm(termsKey) as unknown[];
        return Array.isArray(phrases) ? phrases.map((phrase) => rt(phrase as string)) : [];
    });

    const isVisible = computed<boolean>(() => {
        const activeSearchTerm = toValue(searchTerm);
        if (!activeSearchTerm) {
            return true;
        }

        const searchKeys = SearchUtils.makeKeys(activeSearchTerm);

        const resolvedPhrases = [...localisedPhrases.value, ...(toValue(extraPhrases) ?? [])];
        const searchableText = resolvedPhrases.filter(isNonEmptyPhrase).join(' ');

        return SearchUtils.isSearched(searchKeys, searchableText);
    });

    return { isVisible };
}
