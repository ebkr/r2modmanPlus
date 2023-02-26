import FsProvider from '../providers/generic/file/FsProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import ApiData from '../model/api/ApiData';
import FileUtils from './FileUtils';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';

export default class ApiCacheUtils {

    private static CACHED_REQUEST: ApiData | undefined = undefined;

    public static async getLastRequestCached() {
        if (this.CACHED_REQUEST !== undefined) {
            return this.CACHED_REQUEST;
        } else {
            return await this.getLastRequest();
        }
    }

    public static async getLastRequest(): Promise<ApiData | undefined> {
        if (PathResolver.MOD_ROOT.length > 0) {
            if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, "last_api_request.json"))) {
                try {
                    const lastCacheContent = (await FsProvider.instance.readFile(path.join(PathResolver.MOD_ROOT, "last_api_request.json"))).toString();
                    const apiData = JSON.parse(lastCacheContent) as ApiData;
                    if (ThunderstorePackages.EXCLUSIONS.length > 0) {
                        apiData.exclusions = ThunderstorePackages.EXCLUSIONS
                    }
                    this.CACHED_REQUEST = apiData;
                    return apiData;
                } catch (e) {
                    return undefined;
                }
            }
        }
        return undefined;
    }

    public static async storeLastRequest(data: any) {
        if (PathResolver.MOD_ROOT.length > 0) {
            await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
            const apiData: ApiData = {
                time: new Date(),
                payload: data,
                exclusions: ThunderstorePackages.EXCLUSIONS
            }
            this.CACHED_REQUEST = apiData;
            await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, "last_api_request.json"), JSON.stringify(apiData));
        }
    }

}
