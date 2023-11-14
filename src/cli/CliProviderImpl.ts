import { CliProgressCallback, CliProvider, CliStateCallback } from 'src/cli/CliProvider';
import VersionNumber from 'src/model/VersionNumber';
import { EventManager } from 'src/cli/EventManager';
import Profile from 'src/model/Profile';

export default class CliProviderImpl implements CliProvider {

    downloadPackage(packageName: string, version: VersionNumber, downloadEventManager: EventManager<CliProgressCallback>, writeToDiskEventManager: EventManager<CliProgressCallback>, successStateManager: EventManager<CliStateCallback>): Promise<void> {
        return Promise.reject("Not yet implemented");
    }

    getRequiredPackageUpdates(profile: Profile): Promise<string[]> {
        return Promise.reject("Not yet implemented");
    }

    hasPackageExtractedSuccessfully(packageName: string, version: VersionNumber): Promise<boolean> {
        return Promise.reject("Not yet implemented");
    }

    installPackage(
        packageName: string,
        version: VersionNumber,
        writeToDiskEventManager: () => EventManager<CliProgressCallback>,
        successStateManager: () => EventManager<CliStateCallback>)
        : Promise<void>
    {
        return Promise.reject("Not yet implemented");
    }

    isPackageInCache(packageName: string, version: VersionNumber): Promise<boolean> {
        return Promise.reject("Not yet implemented");
    }

}
