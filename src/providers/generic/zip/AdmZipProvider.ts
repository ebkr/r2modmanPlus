import ZipProvider from './ZipProvider';
import ZipBuilder from './ZipBuilder';
import ZipEntryInterface from './ZipEntryInterface';

export default class AdmZipProvider extends ZipProvider {

    async extractAllTo(zip: string | Buffer, outputFolder: string): Promise<void> {
        return window.zip.extractAllTo(zip, outputFolder);
    }

    // Type is Promise<Buffer | null>
    async readFile(zip: string | Buffer, file: string): Promise<any> {
        return window.zip.readFile(zip, file);
    }

    async getEntries(zip: string): Promise<ZipEntryInterface[]> {
        return window.zip.getEntries(zip) as ZipEntryInterface[];
    }

    async extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void> {
        return window.zip.extractEntryTo(zip, target, outputPath);
    }

    zipBuilder(): ZipBuilder {
        return new AdmZipBuilder();
    }
}

export class AdmZipBuilder extends ZipBuilder {

    private readonly identifier: number;

    constructor() {
        super();
        this.identifier = window.zip.createNewTemporaryZip();
    }

    async addBuffer(fileName: string, contents: Buffer): Promise<void> {
        return window.zip.addBufferToTemporaryZip(this.identifier, fileName, contents);
    }

    async addFolder(zippedFolderName: string, folderName: string): Promise<void> {
        return window.zip.addFolderToTemporaryZip(this.identifier, zippedFolderName, folderName);
    }

    async createZip(outputPath: string): Promise<void> {
        return window.zip.finalizeTemporaryZip(this.identifier, outputPath);
    }

}
