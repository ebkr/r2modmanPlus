// TODO QUASAR UPGRADE

import ZipProvider from './ZipProvider';
// import AdmZip from 'adm-zip';
import ZipBuilder from './ZipBuilder';
import ZipEntryInterface from './ZipEntryInterface';

export default class AdmZipProvider extends ZipProvider {

    async extractAllTo(zip: string | Buffer, outputFolder: string): Promise<void> {
        // const adm = new AdmZip(zip);
        // outputFolder = outputFolder.replace(/\\/g, '/');
        // adm.extractAllTo(outputFolder, true);
    }

    // Type is Promise<Buffer | null>
    async readFile(zip: string | Buffer, file: string): Promise<any> {
        // const adm = new AdmZip(zip);
        // return adm.readFile(file);
    }

    // Type is Promise<ZipEntryInterface[]>
    async getEntries(zip: string | Buffer): Promise<any> {
        // const adm = new AdmZip(zip);
        // return (adm.getEntries() as unknown as ZipEntryInterface[]);
    }

    async extractEntryTo(zip: string | Buffer, target: string, outputPath: string): Promise<void> {
        // const adm = new AdmZip(zip);
        // const safeTarget = target.replace(/\\/g, '/');
        // outputPath = outputPath.replace(/\\/g, '/');
        // var fullPath = path.join(outputPath, safeTarget).replace(/\\/g, '/');
        // if(!path.posix.normalize(fullPath).startsWith(outputPath))
        // {
        //     throw Error("Entry " + target + " would extract outside of expected folder");
        // }
        // adm.extractEntryTo(target, outputPath, true, true);
    }

    zipBuilder(): ZipBuilder {
        return new AdmZipBuilder();
    }
}

export class AdmZipBuilder extends ZipBuilder {

    // private readonly zip: AdmZip;

    constructor() {
        super();
        // this.zip = new AdmZip();
    }

    async addBuffer(fileName: string, contents: Buffer): Promise<void> {
        // this.zip.addFile(fileName, contents);
    }

    async addFolder(zippedFolderName: string, folderName: string): Promise<void> {
        // this.zip.addLocalFolder(folderName, zippedFolderName);
    }

    async createZip(outputPath: string): Promise<void> {
        // this.zip.writeZip(outputPath);
    }

}
