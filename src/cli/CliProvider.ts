import ProviderUtils from '../providers/generic/ProviderUtils';
import VersionNumber from '../model/VersionNumber';
import R2Error from '../model/errors/R2Error';
import { EventManager } from './EventManager';
import Profile from '../model/Profile';

let provider: () => CliProvider;

export function setCliProvider(providerCall: () => CliProvider) {
    provider = providerCall;
}

export function cliProvider(): CliProvider {
    if (provider === undefined) {
        ProviderUtils.throwNotProvidedError("FsProvider");
    }
    return provider();
}

export type CliProgressCallback = {
    currentBytes: number
    totalBytes: number
}

export type CliStateCallback = {
    finished: boolean
    error?: R2Error
}

export interface CliProvider {

    isPackageInCache: (packageName: string, version: VersionNumber) => boolean;
    hasPackageExtractedSuccessfully: (packageName: string, version: VersionNumber) => boolean;
    // Returns an array of package full names to install
    // EG: author-modname-1.2.3
    getRequiredPackageUpdates: (profile: Profile) => string[];

    downloadPackage: (
        packageName: string,
        version: VersionNumber,
        downloadEventManager: EventManager<CliProgressCallback>,
        writeToDiskEventManager: () => EventManager<CliProgressCallback>,
        successStateManager: () => EventManager<CliStateCallback>
    ) => void;

    installPackage: (
        packageName: string,
        version: VersionNumber,
        writeToDiskEventManager: () => EventManager<CliProgressCallback>,
        successStateManager: () => EventManager<CliStateCallback>
    ) => void;

}
