import ConflictManagementProvider from '../../providers/generic/installing/ConflictManagementProvider';
import ManifestV2 from '../../model/ManifestV2';
import Profile from '../../model/Profile';
import R2Error from '../../model/errors/R2Error';

export default class NoResolutionConflictManagement extends ConflictManagementProvider {
    async isFileActive(mod: ManifestV2, profile: Profile, file: string) {
        return false;
    }

    async overrideInstalledState(mod: ManifestV2, profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

    async resolveConflicts(mods: ManifestV2[], profile: Profile): Promise<R2Error | void> {
        return Promise.resolve(undefined);
    }

}
