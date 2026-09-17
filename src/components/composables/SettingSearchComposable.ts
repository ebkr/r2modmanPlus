import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';

import SearchUtils from '../../utils/SearchUtils';

export type SettingSearchPhrases = MaybeRefOrGetter<(string | undefined | null)[]>;

function isNonEmptyPhrase(phrase: string | undefined | null): phrase is string {
    return phrase !== null && phrase !== undefined && phrase !== '';
}

export function useSettingSearch(
    searchTerm: MaybeRefOrGetter<string | undefined>,
    keyPhrases: SettingSearchPhrases
): { isVisible: ComputedRef<boolean> } {
    const isVisible = computed<boolean>(() => {
        const activeSearchTerm = toValue(searchTerm);
        if (!activeSearchTerm) {
            return true;
        }

        const searchKeys = SearchUtils.makeKeys(activeSearchTerm);

        const resolvedPhrases = toValue(keyPhrases);
        const nonEmptyPhrases = resolvedPhrases.filter(isNonEmptyPhrase);
        const searchableText = nonEmptyPhrases.join(' ');

        return SearchUtils.isSearched(searchKeys, searchableText);
    });

    return { isVisible };
}
