import { ipcRenderer } from 'electron';

export function extractAllTo(zip: string, outputFolder: string): Promise<void> {
    return ipcRenderer.invoke('zip:extractAllTo', zip, outputFolder);
}

export function readFile(zip: string | Buffer, file: string): Promise<string> {
    return ipcRenderer.invoke('zip:readFile', zip, file);
}

export function getEntries(zip: string): Promise<any> {
    return ipcRenderer.invoke('zip:getEntries', zip);
}

export function extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void> {
    return ipcRenderer.invoke('zip:extractEntryTo', zip, target, outputPath);
}

/**
 * Create a temporary in-memory zip.
 * @return number representing identifier for subsequent calls to modify zip.
 */
export function createNewTemporaryZip(): number {
    return ipcRenderer.sendSync(`zip:create:new`);
}

export function addBufferToTemporaryZip(identifier: number, fileName: string, content: Buffer): Promise<void> {
    return ipcRenderer.invoke('zip:create:addBuffer', identifier, fileName, content);
}

export function addFolderToTemporaryZip(identifier: number, zippedFolderName: string, folderNameOnDisk: string): Promise<void> {
    return ipcRenderer.invoke('zip:create:addFolder', identifier, zippedFolderName, folderNameOnDisk);
}

export function finalizeTemporaryZip(identifier: number, outputPath: string): Promise<void> {
    return ipcRenderer.invoke('zip:create:finalize', identifier, outputPath);
}
