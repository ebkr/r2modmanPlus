import 'mocha';
import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import ManagerSettings from '../../../src/r2mm/manager/ManagerSettings';
import PathResolver from '../../../src/r2mm/manager/PathResolver';
import TestSetup from '../../test-setup.test';

describe('ManagerSettings', () => {

    before(() => {
        TestSetup.setUp();
    });

    after(() => {
        TestSetup.tearDown();
    });

    context('Singleton construction', () => {
        it('Singletons should be the same object', () => {
            expect(ManagerSettings.getSingleton() === ManagerSettings.getSingleton());
        });
    });

    it('Ensure file is created on construction', () => {
        expect(fs.existsSync(path.join(PathResolver.ROOT, 'config', 'conf.yml'))).equals(false);
        ManagerSettings.getSingleton().load();
        expect(fs.existsSync(path.join(PathResolver.ROOT, 'config', 'conf.yml'))).equals(true);
    });

    context('Ensure values saved', () => {
        it('Expand/collapse cards', () => {
            booleanSettingTestHelper(
                'expandedCards',
                () => ManagerSettings.getSingleton().expandCards(),
                () => ManagerSettings.getSingleton().collapseCards()
            );
        });

        it('Funky mode', () => {
            booleanSettingTestHelper(
                'funkyModeEnabled',
                () => ManagerSettings.getSingleton().setFunkyMode(true),
                () => ManagerSettings.getSingleton().setFunkyMode(false)
            );
        });

        it('Ignore cache', () => {
            booleanSettingTestHelper(
                'ignoreCache',
                () => ManagerSettings.getSingleton().setIgnoreCache(true),
                () => ManagerSettings.getSingleton().setIgnoreCache(false)
            );
        });

        it('Legacy install mode', () => {
            booleanSettingTestHelper(
                'legacyInstallMode',
                () => ManagerSettings.getSingleton().setLegacyInstallMode(true),
                () => ManagerSettings.getSingleton().setLegacyInstallMode(false)
            );
        });

        it('Dark theme', () => {
            booleanSettingTestHelper(
                'darkTheme',
                () => ManagerSettings.getSingleton().toggleDarkTheme(),
                () => ManagerSettings.getSingleton().toggleDarkTheme()
            );
        });

    });

});

const assertPropertyAndValueFromConfigFile = (property: string, value: any): Chai.Assertion => {
    const file = path.join(PathResolver.ROOT, 'config', 'conf.yml');
    if (fs.existsSync(file)) {
        const yamlData = yaml.parse(fs.readFileSync(file).toString());
        return expect(yamlData[property]).equals(value);
    }
    throw new Error('File does not exist');
};

const booleanSettingTestHelper = (setting: string, enable: Function, disable: Function) => {
    ManagerSettings.getSingleton().load();
    expect(_getSettingsData()[setting]).equals(false);
    assertPropertyAndValueFromConfigFile(setting, false);
    enable();
    expect(_getSettingsData()[setting]).equals(true);
    assertPropertyAndValueFromConfigFile(setting, true);
    disable();
    expect(_getSettingsData()[setting]).equals(false);
    assertPropertyAndValueFromConfigFile(setting, false);
};

const _getSettingsData = (): { [key: string]: any } => {
    return JSON.parse(JSON.stringify(ManagerSettings.getSingleton()));
};
