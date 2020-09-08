import 'mocha';
import PathResolver from '../src/r2mm/manager/PathResolver';
import * as fs from 'fs-extra';
import Profile from '../src/model/Profile';

export default class TestSetup {

    public static setUp() {
        PathResolver.APPDATA_DIR = '__test_data__';
        new Profile('Default');
    }

    public static tearDown() {
        fs.emptyDirSync(PathResolver.APPDATA_DIR);
        fs.removeSync(PathResolver.APPDATA_DIR);
    }

}
