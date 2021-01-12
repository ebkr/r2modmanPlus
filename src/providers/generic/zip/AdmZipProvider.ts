import ZipProvider from './ZipProvider';
import AdmZip, { IZipEntry } from 'adm-zip';
import * as path from 'path';
import ZipBuilder from './ZipBuilder';
import ZipEntryInterface from './ZipEntryInterface';
import FileUtils from 'src/utils/FileUtils';
import FsProvider from '../file/FsProvider';

export default class AdmZipProvider extends ZipProvider {

    async extractAllTo(zip: string | Buffer, outputFolder: string): Promise<void> {
        const adm = new AdmZip(zip);
        for (let entry of adm.getEntries()) {
            await this.sanitizedExtraction(entry, outputFolder);
        }
    }

    async readFile(zip: string | Buffer, file: string): Promise<Buffer | null> {
        const adm = new AdmZip(zip);
        return adm.readFile(file);
    }

    async getEntries(zip: string | Buffer): Promise<ZipEntryInterface[]> {
        const adm = new AdmZip(zip);
        return adm.getEntries();
    }

    async extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void> {
        const adm = new AdmZip(zip);
        return this.sanitizedExtraction(adm.getEntry(target), outputPath);
    }

    private async sanitizedExtraction(entry: IZipEntry, outputPath: string): Promise<void> {
        const sanitizedTargetName = entry.entryName.split('\\').join('/');
        await FileUtils.ensureDirectory(path.dirname(path.join(outputPath, sanitizedTargetName)));
        if (entry.isDirectory)
            await FileUtils.ensureDirectory(path.join(outputPath, sanitizedTargetName));
        else
            await FsProvider.instance.writeFile(path.join(outputPath, sanitizedTargetName), entry.getData());
    }

    zipBuilder(): ZipBuilder {
        return new AdmZipBuilder();
    }
}

export class AdmZipBuilder extends ZipBuilder {

    private readonly zip: AdmZip;

    constructor() {
        super();
        this.zip = new AdmZip();
    }

    async addBuffer(fileName: string, contents: Buffer): Promise<void> {
        this.zip.addFile(fileName, contents);
    }

    async addFolder(zippedFolderName: string, folderName: string): Promise<void> {
        this.zip.addLocalFolder(folderName, zippedFolderName);
    }

    async createZip(outputPath: string): Promise<void> {
        this.zip.writeZip(outputPath);
    }

}
