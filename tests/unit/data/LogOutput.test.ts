import 'mocha';
import { expect } from 'chai';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import Profile from '../../../src/model/Profile';
import '../../test-setup.test';

describe('LogOutput', () => {

    it('Singletons should be the same object', () => {
        expect(LogOutput.getSingleton()).equals(LogOutput.getSingleton());
    });

});
