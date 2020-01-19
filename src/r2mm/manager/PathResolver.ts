import * as path from 'path';

export default class PathResolver {
    public static ROOT = process.env.PROD ? path.join(process.execPath, '../') : process.cwd()
}