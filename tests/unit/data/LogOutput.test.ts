import 'mocha';
import { expect } from 'chai';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import Profile from '../../../src/model/Profile';

describe('LogOutput', () => {

    it('Singletons should be the same object', () => {
        new Profile("default");
        expect(LogOutput.getSingleton()).equals(LogOutput.getSingleton());
    });

});
