import * as path from 'path';

export default class FileDragDrop {

    /**
     * Check to see if a file is being dragged
     * @param ev
     */
    public static isFile(ev: DragEvent): boolean {
        return this.getFiles(ev).length > 0;
    }

    /**
     * Return true if multiple files are being dragged
     * @param ev
     */
    public static areMultipleFilesDragged(ev: DragEvent): boolean {
        return this.getFiles(ev).length > 1;
    }

    /**
     * Ensures all files being dragged all have required file extensions
     * @param ev
     * @param extensions
     */
    public static areAllFileExtensionsIn(ev: DragEvent, extensions: Array<string>): boolean {
        for (let file of this.getFiles(ev)) {
            let matchingExtension = false;
            for (let extension of extensions) {
                if (file.name.toLowerCase().endsWith(extension.toLowerCase())) {
                    matchingExtension = true;
                }
            }
            if (!matchingExtension) {
                return false;
            }
        }
        return true;
    }

    public static getFiles(ev: DragEvent): Array<File> {
        const fileArray = new Array<File>();
        for (let item of ev.dataTransfer!.items) {
            if (item.getAsFile() !== null) {
                fileArray.push(item.getAsFile()!);
            }
        }
        return fileArray;
    }
}
