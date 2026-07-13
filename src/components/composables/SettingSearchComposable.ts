import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';

import SearchUtils from '../../utils/SearchUtils';

export type SettingSearchPhrases = MaybeRefOrGetter<(string | undefined | null)[]>;

export function useSettingSearch(
    searchTerm: MaybeRefOrGetter<string | undefined>,
    keyPhrases: SettingSearchPhrases
): { isVisible: ComputedRef<boolean> } {
    const isVisible = computed<boolean>(() => {
        const term = toValue(searchTerm);
        if (!term) {
            return true;
        }
        const keys = SearchUtils.makeKeys(term);
        const haystack = toValue(keyPhrases)
            .filter((phrase): phrase is string => Boolean(phrase))
            .join(' ');
        return SearchUtils.isSearched(keys, haystack);
    });

    return { isVisible };
}
