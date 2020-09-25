import 'mocha';
import { expect } from 'chai';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import Profile from '../../../src/model/Profile';
import TestSetup from '../../test-setup.test';
import * as fs from 'fs-extra';
import * as path from "path";

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('LogOutput', () => {

    before(() => {
        TestSetup.setUp();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context('Singleton construction', () => {
        it('Singletons should be the same object', () => {
            expect(LogOutput.getSingleton()).equals(LogOutput.getSingleton());
        });
    });

    context('LogOutput exists', () => {
        it('File does not exist', () => {
            expect(LogOutput.getSingleton().exists).equals(false);
        });
        it('File exists', async () => {
            // Ensure directory exists prior to writing file
            fs.ensureDirSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx'));
            fs.writeFileSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log'), "");
            await timeout(1100);
            expect(LogOutput.getSingleton().exists).equals(true);
        });
    });

});

after(async () => {
    // Interval is required to be disconnected to allow test runner to close.
    LogOutput.getSingleton().disconnect();
})
