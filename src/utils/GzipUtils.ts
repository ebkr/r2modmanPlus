// Use third party library as Node's zlib is not available on TSMM.
import { AsyncGunzip } from "fflate";

export function decompressArrayBuffer(compressed: ArrayBuffer, encoding = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject) => {
        const gunzip = new AsyncGunzip((err, result) => {
            if (err) {
                return reject(err);
            }

            const decoder = new TextDecoder(encoding);
            const decodedString = decoder.decode(result);
            return resolve(decodedString);
        });

        gunzip.push(new Uint8Array(compressed), true);
    });
}
