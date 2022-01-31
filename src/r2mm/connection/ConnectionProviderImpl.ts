import ConnectionProvider from '../../providers/generic/connection/ConnectionProvider';
import GameManager from '../../model/game/GameManager';
import axios from 'axios';

export default class ConnectionProviderImpl extends ConnectionProvider {

    private exclusionsToMap(exclusions: string[]): Map<string, boolean> {
        const map = new Map<string, boolean>();
        exclusions.forEach(value => {
            if (value.length > 0) {
                map.set(value, true);
            }
        });
        return map;
    }

    private getExclusionsFromInternalFile(): Map<string, boolean> {
        const manualExclusions = require("../../../modExclusions.json");
        const stringExclusions = (manualExclusions.exclusions as string[]);
        return this.exclusionsToMap(stringExclusions);
    }

    private async getExclusionsFromRemote(downloadProgressed?: (percentDownloaded: number) => void): Promise<Map<string, boolean>> {
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
            const exclusionList = (response.data!).split("\n");
            const filteredList = exclusionList.filter((x: string) => x.trim().length > 0);
            return this.exclusionsToMap(filteredList);
        });
    }

    public async getExclusions(downloadProgressed?: (percentDownloaded: number) => void, attempt?: number): Promise<Map<string, boolean>> {
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
