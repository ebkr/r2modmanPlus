export default class SearchUtils {
    public static makeKeys(search: string) {
        return search.trim().toLowerCase().split(' ');
    }

    public static isSearched(keys: string[], name: string, description: string) {
        name = name.toLowerCase();
        description = description.toLowerCase();
        return keys.every(i => name.indexOf(i) >= 0 || description.indexOf(i) >= 0);
    }
}
