import 'mocha';
import { expect } from 'chai';
import TestSetup from '../../test-setup.test';
import { SortDirection } from '../../../src/model/real_enums/sort/SortDirection';
import ConfigFile from '../../../src/model/file/ConfigFile';
import ConfigSort from '../../../src/r2mm/configs/ConfigSort';
import { SortConfigFile } from '../../../src/model/real_enums/sort/SortConfigFile';

describe('ConfigSort', () => {

    before(() => {
        TestSetup.setUp();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context("Basic sort tests", () => {

        // No change expected
        it("Name sort", () => {
            const configList: ConfigFile[] = [
                new ConfigFile("filename.txt", "/", new Date()),
                new ConfigFile("filename2.txt", "/", new Date()),
            ];
            const sortedList = ConfigSort.sort(configList, SortConfigFile.NAME, SortDirection.STANDARD);
            for (let i=0; i<configList.length; i++) {
                expect(configList[i]).equals(sortedList[i]);
            }
        });

        // Expect results to be reversed
        it("Reverse sort", () => {
            const configList: ConfigFile[] = [
                new ConfigFile("filename.txt", "/", new Date()),
                new ConfigFile("filename2.txt", "/", new Date()),
            ];
            const sortedList = ConfigSort.sort(configList, SortConfigFile.NAME, SortDirection.REVERSE);
            for (let i=0; i<configList.length; i++) {
                expect(configList[configList.length - 1 - i]).equals(sortedList[i]);
            }
        });

        // Expect results to be reversed
        it("Date sort", () => {
            const dateA = new Date();
            dateA.setHours(1);

            const dateB = new Date(dateA);
            dateB.setHours(2);

            const configList: ConfigFile[] = [
                new ConfigFile("filename.txt", "/", dateA),
                new ConfigFile("filename2.txt", "/", dateB),
            ];
            const sortedList = ConfigSort.sort(configList, SortConfigFile.LAST_UPDATED, SortDirection.STANDARD);
            for (let i=0; i<configList.length; i++) {
                expect(configList[configList.length - 1 - i]).equals(sortedList[i]);
            }
        });


    });

});
