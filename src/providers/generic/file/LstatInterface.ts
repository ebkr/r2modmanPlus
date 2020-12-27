export default interface LstatInterface {

    isDirectory: () => boolean;
    isFile: () => boolean;
    mtime: Date;

}
