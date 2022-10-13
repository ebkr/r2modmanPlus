export default interface ApiResponse {
    data: any[];
}

export const isApiResonse = (arg: any): arg is ApiResponse => Array.isArray(arg.data);
