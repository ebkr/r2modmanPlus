export default interface ModDownloadProgressDto {

    mod: string,
    downloadProgress: number
    downloadedSize: number,
    totalSize: number,
    isDependency: boolean

}
