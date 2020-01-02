export default class EnumResolver {

    public static from(enumSet: {[key: string]: any}, value: any) {
        for(const enumIndex in enumSet) {
            if (enumSet[enumIndex] === value) {
                return enumIndex;
            }
        }
    }

}