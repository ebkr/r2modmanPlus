export default class R2Error extends Error {
    public name: string;
    public message: string;
    public stack?: string | undefined;
    public solution: string;
    public errorReferenceString: string | undefined;

    public constructor(name: string, message: string, solution: string | null) {
        super(message);
        this.name = name;
        this.message = message;
        this.solution = solution || '';
    }
}
