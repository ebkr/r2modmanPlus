export default class EnumResolver {

    public static from<T>(enumSet: {[key: string]: any}, value: any): T {
        for(const enumIndex in enumSet) {
            if (enumSet[enumIndex] === value) {
                return enumIndex as unknown as T;
            }
        }
        const keys = Object.keys(enumSet).join(", ");
        throw new Error(`Unknown value: ${value}. Not in keys of: ${keys}`);
    }

}
