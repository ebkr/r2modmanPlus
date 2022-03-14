import R2Error from '../../model/errors/R2Error';
import Mod from '../../model/Mod';

export default interface DownloadProgress {
    progress: number;
    mod: Mod;
    status: number;
    currentModDownloadSize: number;
    currentModDownloadProgress: number;
    err: R2Error | null;
}
