export enum ExactSearchMatchRank {
    NONE = 0,
    AUTHOR = 1,
    NAME = 2,
    SOFT_AUTHOR = 3,
    SOFT_NAME = 4,
}

const softMatcher = new RegExp(' |_', 'g');

export default class SearchUtils {
    public static makeKeys(search: string) {
        console.log(search.trim().toLowerCase().split(softMatcher));
        return search.trim().toLowerCase().split(softMatcher);
    }

    public static isSearched(keys: string[], name: string, description?: string) {
        name = name.replaceAll(softMatcher, '').toLowerCase();
        if (description) {
            description = description.toLowerCase();
        } else {
            description = '';
        }
        return keys.every(i => name.indexOf(i) >= 0 || description.indexOf(i) >= 0);
    }

    public static getExactMatchRank(query: string, name: string, fullName: string, author: string): ExactSearchMatchRank {
        if (query.length === 0) {
            return ExactSearchMatchRank.NONE;
        }
        if (name.toLowerCase() === query || fullName.toLowerCase() === query) {
            return ExactSearchMatchRank.NAME;
        }
        if (author.toLowerCase() === query) {
            return ExactSearchMatchRank.AUTHOR;
        }

        const softQuery = query.replaceAll(softMatcher, '').toLowerCase();
        const softName = name.replaceAll(softMatcher, '');
        const softFullName = fullName.replaceAll(softMatcher, '');
        const softAuthor = author.replaceAll(softMatcher, '');

        if (softName.toLowerCase() === softQuery || softFullName.toLowerCase() === softQuery) {
            console.log('Soft name match');
            return ExactSearchMatchRank.SOFT_NAME;
        }
        if (softAuthor.toLowerCase() === softQuery) {
            return ExactSearchMatchRank.SOFT_AUTHOR;
        }

        return ExactSearchMatchRank.NONE;
    }
}
