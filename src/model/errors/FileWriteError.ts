import R2Error from './R2Error';

export default class FileWriteError extends R2Error {
    public static fromThrownValue(
        error: R2Error | Error | unknown,
        name: string = "An unhandled error occurred",
        solution: string | null = null,
    ): FileWriteError {
        return super.fromThrownValue(error, name, solution) as FileWriteError;
    }
}
