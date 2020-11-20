import 'mocha';
import { expect } from 'chai';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
import * as path from 'path';
import * as yaml from 'yaml';
import ManagerSettings from '../../../src/r2mm/manager/ManagerSettings';
import PathResolver from '../../../src/r2mm/manager/PathResolver';
import TestSetup from '../../test-setup.test';

describe('ManagerSettings', () => {

    let settings!: ManagerSettings;

    before(async () => {
        TestSetup.setUp();
        settings = await ManagerSettings.getSingleton();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context('Singleton construction', () => {
        it('Singletons should be the same object', () => {
            expect(settings === settings);
        });
    });

    context('Ensure values saved', () => {
        it('Expand/collapse cards', () => {
            booleanSettingTestHelper(
                'expandedCards',
                () => settings.expandCards(),
                () => settings.collapseCards()
            );
        });

        it('Funky mode', () => {
            booleanSettingTestHelper(
                'funkyModeEnabled',
                () => settings.setFunkyMode(true),
                () => settings.setFunkyMode(false)
            );
        });

        it('Ignore cache', () => {
            booleanSettingTestHelper(
                'ignoreCache',
                () => settings.setIgnoreCache(true),
                () => settings.setIgnoreCache(false)
            );
        });

        it('Dark theme', () => {
            booleanSettingTestHelper(
                'darkTheme',
                () => settings.toggleDarkTheme(),
                () => settings.toggleDarkTheme()
            );
        });

    });

});

const assertPropertyAndValueFromConfigFile = async (property: string, value: any): Promise<Chai.Assertion> => {
    const fs = FsProvider.instance;
    const file = path.join(PathResolver.ROOT, 'config', 'conf.yml');
    if (await fs.exists(file)) {
        const yamlData = yaml.parse(fs.readFile(file).toString());
        return expect(yamlData[property]).equals(value);
    }
    throw new Error('File does not exist');
};

const booleanSettingTestHelper = async (setting: string, enable: Function, disable: Function) => {
    const settings = await ManagerSettings.getSingleton();
    await settings.load();
    expect((await _getSettingsData())[setting]).equals(false);
    await assertPropertyAndValueFromConfigFile(setting, false);
    enable();
    expect((await _getSettingsData())[setting]).equals(true);
    await assertPropertyAndValueFromConfigFile(setting, true);
    disable();
    expect((await _getSettingsData())[setting]).equals(false);
    await assertPropertyAndValueFromConfigFile(setting, false);
};

const _getSettingsData = async (): Promise<{ [key: string]: any }> => {
    return JSON.parse(JSON.stringify(await ManagerSettings.getSingleton()));
};
