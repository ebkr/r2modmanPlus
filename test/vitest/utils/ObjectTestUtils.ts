export default class ObjectTestUtils {

    public static lazyClone<T>(copy: T): T {
        const obj: any = {};
        Object.keys(copy).forEach((key: any) => {
            obj[key] = (copy as any)[key];
        });
        return obj as unknown as T;
    }

}
