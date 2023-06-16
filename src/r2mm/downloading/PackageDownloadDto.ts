import ModDownloadProgressDto from '../downloading/ModDownloadProgressDto';
import R2Error from '../../model/errors/R2Error';

export interface PackageDownloadDto {

    mods: ModDownloadProgressDto[]
    totalProgress: number,
    totalSize: number,
    hasErrored: boolean,
    error?: R2Error,
    currentPosition: number,
    finalPosition: number,

}
