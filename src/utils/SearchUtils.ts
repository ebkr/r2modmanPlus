export enum ExactSearchMatchRank {
    NONE = 0,
    AUTHOR = 1,
    NAME = 2,
}

export default class SearchUtils {
    public static makeKeys(search: string) {
        return search.trim().toLowerCase().split(' ');
    }

    public static isSearched(keys: string[], name: string, description?: string) {
        name = name.toLowerCase();
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
        return ExactSearchMatchRank.NONE;
    }
}
