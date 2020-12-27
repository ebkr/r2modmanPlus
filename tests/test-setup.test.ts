import 'mocha';
import PathResolver from '../src/r2mm/manager/PathResolver';
import FsProvider from '../src/providers/generic/file/FsProvider';
import Profile from '../src/model/Profile';
import FileUtils from '../src/utils/FileUtils';
import NodeFs from '../src/providers/generic/file/NodeFs';

export default class TestSetup {

    public static setUp() {
        const fs = new NodeFs();
        FsProvider.provide(() => fs);
        PathResolver.APPDATA_DIR = '__test_data__';
        new Profile('Default');
    }

    public static async tearDown() {
        const fs = FsProvider.instance;
        await FileUtils.emptyDirectory(PathResolver.APPDATA_DIR);
        await fs.rmdir(PathResolver.APPDATA_DIR);
    }

}
