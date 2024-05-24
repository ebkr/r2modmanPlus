// Split array to multiple arrays of given size.
export function chunk<T>(original: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
        throw new Error('chunk requires positive integer as chunkSize');
    }

    const result: T[][] = [];
    const len = original.length;

    for (let i = 0; i < len; i += chunkSize) {
        result.push(original.slice(i, i + chunkSize));
    }

    return result;
}
