import ThunderstoreMod from 'src/model/ThunderstoreMod';
import VersionNumber from 'src/model/VersionNumber';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';
import axios from 'axios';
import StatusEnum from 'src/model/enums/StatusEnum';
import DownloadError from 'src/model/errors/DownloadError';

export default class ThunderstoreDownloader {

    private mod: ThunderstoreMod;

    public constructor(mod: ThunderstoreMod) {
        this.mod = mod;
    }

    /** 
     * Download mod's zip file. 
     * If download fails, alert callback that an error has occured.
     * Callback should log this error.
    */
    public download(callback: Function, versionNumber: VersionNumber) {
        const tsVersions: ThunderstoreVersion[] = this.mod.getVersions();
        const version: ThunderstoreVersion | undefined = tsVersions.find((v: ThunderstoreVersion) => v.getVersionNumber().toString() === versionNumber.toString());
        
        if (version !== undefined) {
            axios.get(version.getDownloadUrl(), {

            }).then(response => {
                console.log(response);
                callback(100, StatusEnum.SUCCESS);
            })
        } else {
            callback(0, StatusEnum.FAILURE, 
                new DownloadError(
                    'Download Failure', 
                    `Failed to find version of mod: ${this.mod.getName()}, with version of: ${versionNumber.toString}`
                )
            );
        }
    }

}