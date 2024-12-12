export default class R2Error extends Error {
    public name: string;
    public message: string;
    public stack?: string | undefined;
    public solution: string;
    public errorReferenceString: string | undefined;

    public constructor(name: string, message: string, solution: string | null = null) {
        super(message);
        this.name = name;
        this.message = message;
        this.solution = solution || '';
        Object.setPrototypeOf(this, R2Error.prototype);
    }

    public static fromThrownValue(
        error: R2Error | Error | unknown,
        name: string = "An unhandled error occurred",
        solution: string | null = null,
    ): R2Error {
        if (error instanceof R2Error) {
            return error
        } else if (error instanceof Error) {
            return new R2Error(name, error.message, solution);
        } else {
            return new R2Error(name, `${error}`, solution);
        }
    }
}

/**
 * Throws the given value if it's an instance of R2Error.
 */
export function throwForR2Error(maybeError: unknown) {
    if (maybeError instanceof R2Error) {
        throw maybeError;
    }
}
