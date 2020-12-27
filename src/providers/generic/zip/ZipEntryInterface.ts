/**
 * Copied from Adm-Zip's IZipEntry interface.
 */

// Type definitions for adm-zip 0.4
// Project: https://github.com/cthackers/adm-zip
// Definitions by: John Vilk <https://github.com/jvilk>
//                 Abner Oliveira <https://github.com/abner>
//                 BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

export default interface ZipEntryInterface {
    /**
     * Represents the full name and path of the file
     */
    entryName: string;
    readonly rawEntryName: Buffer;
    /**
     * Extra data associated with this entry.
     */
    extra: Buffer;
    /**
     * Entry comment.
     */
    comment: string;
    readonly name: string;
    /**
     * Read-Only property that indicates the type of the entry.
     */
    readonly isDirectory: boolean;
    /**
     * Get the header associated with this ZipEntry.
     */
    header: Buffer;
    attr: number;
    /**
     * Retrieve the compressed data for this entry. Note that this may trigger
     * compression if any properties were modified.
     */
    getCompressedData(): Buffer;
    /**
     * Asynchronously retrieve the compressed data for this entry. Note that
     * this may trigger compression if any properties were modified.
     */
    getCompressedDataAsync(callback: (data: Buffer) => void): void;
    /**
     * Set the (uncompressed) data to be associated with this entry.
     */
    setData(value: string | Buffer): void;
    /**
     * Get the decompressed data associated with this entry.
     */
    getData(): Buffer;
    /**
     * Asynchronously get the decompressed data associated with this entry.
     */
    getDataAsync(callback: (data: Buffer) => void): void;
    /**
     * Returns the CEN Entry Header to be written to the output zip file, plus
     * the extra data and the entry comment.
     */
    packHeader(): Buffer;
    /**
     * Returns a nicely formatted string with the most important properties of
     * the ZipEntry.
     */
    toString(): string;
}
