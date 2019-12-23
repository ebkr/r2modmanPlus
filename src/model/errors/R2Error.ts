export default class R2Error implements Error {
    public name: string;
    public message: string;
    public stack?: string | undefined;

    public constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }
}