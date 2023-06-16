import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import VersionNumber from '../../model/VersionNumber';

export default interface ResolvedDependency {

    name: string,
    version: VersionNumber,
    combo: ThunderstoreCombo

}
