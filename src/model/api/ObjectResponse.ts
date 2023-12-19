export default interface ObjectResponse {
    data: any;
}

export const isObjectResonse = (arg: any): arg is ObjectResponse => {
    if (arg.data != null && arg.data instanceof Object) {
        return true;
    }
    try {
        JSON.parse(arg.data);
        return true;
    } catch {
        return false;
    }
};
