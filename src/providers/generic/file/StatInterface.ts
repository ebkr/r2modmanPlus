export default interface StatInterface {

    isDirectory: () => boolean;
    isFile: () => boolean;
    mtime: Date;
    size: number;

}
