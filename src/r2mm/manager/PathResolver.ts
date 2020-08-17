import * as path from 'path';

export default class PathResolver {

    private static _ROOT: string = '';
    private static _MOD_ROOT: string = '';

    static get ROOT(): string {
        return PathResolver._ROOT;
    }

    static set ROOT(root: string) {
        PathResolver._ROOT = root;
        PathResolver._MOD_ROOT = path.join(root, 'mods');
    }

    static get MOD_ROOT(): string {
        return PathResolver._MOD_ROOT;
    }
}
