import 'mocha';
import PathResolver from '../src/r2mm/manager/PathResolver';
import * as fs from 'fs-extra';
import Profile from '../src/model/Profile';

before(() => {
    PathResolver.ROOT = '__test_data__';
    new Profile("Default");
});

after(() => {
    fs.emptyDirSync(PathResolver.ROOT);
    fs.removeSync(PathResolver.ROOT);
});
