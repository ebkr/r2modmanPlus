import axios from 'axios';

import GameManager from '../../model/game/GameManager';
import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';

export default class ConnectionProviderImpl extends ConnectionProvider {

    public cleanExclusions(exclusions: string|string[]) {
        const exclusions_ = Array.isArray(exclusions) ? exclusions : exclusions.split("\n");
        return exclusions_.map((e) => e.trim()).filter(Boolean);
    }

    public getExclusionsFromInternalFile() {
        const exclusionList: {exclusions: string[]} = require("../../../modExclusions.json");
        return this.cleanExclusions(exclusionList.exclusions);
    }

    private async getExclusionsFromRemote(downloadProgressed?: (percentDownloaded: number) => void) {
        return axios.get(GameManager.activeGame.exclusionsUrl, {
            onDownloadProgress: progress => {
                if (downloadProgressed !== undefined) {
                    downloadProgressed((progress.loaded / progress.total) * 100);
                }
            },
            timeout: 20000
        }).then(response => {
            if (response.data === undefined) {
                throw new Error("Exclusion response was undefined.");
            }
            return this.cleanExclusions(response.data as string);
        });
    }

    public async getExclusions(downloadProgressed?: (percentDownloaded: number) => void, attempt?: number): Promise<string[]> {
        if (attempt === undefined) {
            attempt = 0;
        }
        if (attempt < 5) {
            try {
                return await this.getExclusionsFromRemote(downloadProgressed);
            } catch (e) {
                console.log(e);
                return this.getExclusions(downloadProgressed, attempt + 1);
            }
        } else {
            return this.getExclusionsFromInternalFile();
        }
    }

}
