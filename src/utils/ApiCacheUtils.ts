import FsProvider from '../providers/generic/file/FsProvider';
import PathResolver from '../r2mm/manager/PathResolver';
import * as path from 'path';
import ApiData from '../model/api/ApiData';
import FileUtils from './FileUtils';

export default class ApiCacheUtils {

    public static async getLastRequest(): Promise<ApiData | undefined> {
        if (await FsProvider.instance.exists(path.join(PathResolver.MOD_ROOT, "last_api_request.json"))) {
            try {
                const lastCacheContent = (await FsProvider.instance.readFile(path.join(PathResolver.MOD_ROOT, "last_api_request.json"))).toString();
                return JSON.parse(lastCacheContent) as ApiData;
            } catch (e) {
                return undefined;
            }
        }
        return undefined;
    }

    public static async storeLastRequest(data: any) {
        await FileUtils.ensureDirectory(PathResolver.MOD_ROOT);
        const apiData: ApiData = {
            time: new Date(),
            payload: data
        }
        await FsProvider.instance.writeFile(path.join(PathResolver.MOD_ROOT, "last_api_request.json"), JSON.stringify(apiData));
    }

}
