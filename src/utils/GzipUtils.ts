import * as zlib from 'zlib';

export function decompressArrayBuffer(compressed: ArrayBuffer, encoding = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject) => {
        zlib.gunzip(compressed, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result.toString(encoding));
        });
    });
}
