import ZipEntryInterface from './ZipEntryInterface';

export default abstract class ZipBuilder {

    public abstract addBuffer(fileName: string, contents: Buffer): Promise<void>;

    public abstract addFolder(zippedFolderName: string, folderName: string): Promise<void>;

    public abstract createZip(outputPath: string): Promise<void>;

}
