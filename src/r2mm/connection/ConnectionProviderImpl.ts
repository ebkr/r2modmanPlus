import axios from 'axios';

import GameManager from '../../model/game/GameManager';
import ConnectionProvider, { DownloadProgressed } from '../../providers/generic/connection/ConnectionProvider';

export default class ConnectionProviderImpl extends ConnectionProvider {

    private cleanExclusions(exclusions: string|string[]) {
        const exclusions_ = Array.isArray(exclusions) ? exclusions : exclusions.split("\n");
        return exclusions_.map((e) => e.trim()).filter(Boolean);
    }

    private getExclusionsFromInternalFile() {
        const exclusionList: {exclusions: string[]} = require("../../../modExclusions.json");
        return this.cleanExclusions(exclusionList.exclusions);
    }

    private async getExclusionsFromRemote(downloadProgressed?: DownloadProgressed) {
        const response = await axios.get(GameManager.activeGame.exclusionsUrl, {
            onDownloadProgress: progress => {
                if (downloadProgressed !== undefined) {
                    downloadProgressed((progress.loaded / progress.total) * 100);
                }
            },
            timeout: 20000
        });

        if (response.data === undefined) {
            throw new Error("Exclusion response was undefined.");
        }

        return this.cleanExclusions(response.data as string);
    }

    /**
     * Return a list of packages that might be returned by Thunderstore
     * API but which should not be treated as valid mods by the manager.
     *
     * E.g. the mod manager itself is usually listed under a community
     * for easy access, but attempting to install it as a mod makes no
     * sense.
     */
    public async getExclusions(downloadProgressed?: DownloadProgressed, retries = 4): Promise<string[]> {
        if (retries < 0) {
            throw new Error("Parameter `retries` can't be a negative number");
        }

        const error = `Error while fetching exclusions (${retries} attempts left):`;

        if (retries === 0) {
            try {
                return await this.getExclusionsFromRemote(downloadProgressed);
            } catch (e) {
                console.error(error, e);
                console.log("Reading exclusions from local file");
                return this.getExclusionsFromInternalFile();
            }
        }

        try {
            return await this.getExclusionsFromRemote(downloadProgressed);
        } catch (e) {
            console.error(error, e);
            return this.getExclusions(downloadProgressed, retries - 1);
        }
    }

}
