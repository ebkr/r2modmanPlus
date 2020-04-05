export default class R2Error implements Error {
    public name: string;
    public message: string;
    public stack?: string | undefined;
    public solution: string;

    public constructor(name: string, message: string, solution: string | null) {
        this.name = name;
        this.message = message;
        this.solution = solution || '';
    }
}