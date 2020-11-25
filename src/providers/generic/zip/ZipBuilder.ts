import ZipEntryInterface from './ZipEntryInterface';

export default abstract class ZipBuilder {

    public abstract async addBuffer(fileName: string, contents: Buffer): Promise<void>;

    public abstract async addFolder(zippedFolderName: string, folderName: string): Promise<void>;

    public abstract async createZip(outputPath: string): Promise<void>;

}
