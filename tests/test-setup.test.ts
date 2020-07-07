import 'mocha';
import PathResolver from '../src/r2mm/manager/PathResolver';
import * as fs from 'fs-extra';

before(async () => {
    PathResolver.ROOT = '__test_data__';
});

after(async () => {
    fs.emptyDirSync(PathResolver.ROOT);
    fs.removeSync(PathResolver.ROOT);
});
