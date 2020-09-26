import 'mocha';
import { assert } from 'chai';
import ProfileProvider from '../../../src/providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from '../../../src/r2mm/model_implementation/ProfileImpl';
import LogOutputProvider from '../../../src/providers/ror2/data/LogOutputProvider';
import LogOutput from '../../../src/r2mm/data/LogOutput';
import ThunderstoreDownloaderProvider from '../../../src/providers/ror2/downloading/ThunderstoreDownloaderProvider';
import BetterThunderstoreDownloader from '../../../src/r2mm/downloading/BetterThunderstoreDownloader';
import LocalModInstaller from '../../../src/r2mm/installing/LocalModInstaller';
import LocalModInstallerProvider from '../../../src/providers/ror2/installing/LocalModInstallerProvider';
import ProfileInstallerProvider from '../../../src/providers/ror2/installing/ProfileInstallerProvider';
import ProfileInstaller from '../../../src/r2mm/installing/ProfileInstaller';
import LoggerProvider from '../../../src/providers/ror2/logging/LoggerProvider';
import { Logger } from '../../../src/r2mm/logging/Logger';

describe('Providers', () => {

    context("ProfileProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                ProfileProvider.instance;
            })
        });

        it("Provided", () => {
            ProfileProvider.provide(() => new ProfileImpl());
            assert.doesNotThrow(() => {
                ProfileProvider.instance;
            });
        });

    });

    context("LogOutputProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                LogOutputProvider.instance;
            })
        });

        it("Provided", () => {
            LogOutputProvider.provide(() => LogOutput.getSingleton());
            assert.doesNotThrow(() => {
                LogOutputProvider.instance;
            }, new RegExp("has not been provided"));
        });

    });

    context("ThunderstoreDownloaderProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                ThunderstoreDownloaderProvider.instance;
            })
        });

        it("Provided", () => {
            ThunderstoreDownloaderProvider.provide(() => new BetterThunderstoreDownloader());
            assert.doesNotThrow(() => {
                ThunderstoreDownloaderProvider.instance;
            });
        });

    });

    context("LocalModInstallerProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                LocalModInstallerProvider.instance;
            })
        });

        it("Provided", () => {
            LocalModInstallerProvider.provide(() => new LocalModInstaller());
            assert.doesNotThrow(() => {
                LocalModInstallerProvider.instance;
            });
        });

    });

    context("ProfileInstaller", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                ProfileInstallerProvider.instance;
            })
        });

        it("Provided", () => {
            ProfileInstallerProvider.provide(() => new ProfileInstaller());
            assert.doesNotThrow(() => {
                ProfileInstallerProvider.instance;
            });
        });

    });

    context("LoggerProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                LoggerProvider.instance;
            })
        });

        it("Provided", () => {
            LoggerProvider.provide(() => new Logger());
            assert.doesNotThrow(() => {
                LoggerProvider.instance;
            });
        });

    });

});
