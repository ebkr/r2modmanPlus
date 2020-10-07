export default class ArrayUtils<T> {

    public static includesAll<T>(orig: T[], search: T[]): boolean {
        return orig.filter(value => search.includes(value)).length === search.length;
    }

    public static includesSome<T>(orig: T[], search: T[]): boolean {
        return orig.filter(value => search.includes(value)).length > 0;
    }

}
