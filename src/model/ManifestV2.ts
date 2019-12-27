import Mod from './Mod';
import InvalidManifestError from './errors/Manifest/InvalidManifestError';

export default class ManifestV2 extends Mod {

    private manifestVersion: number = 1;

    public make(data: any): InvalidManifestError | ManifestV2  {
        if (data.ManifestVersion === undefined) {
            return new InvalidManifestError(
                'Data could not be converted to Manifest V2.',
                `Data received: ${JSON.stringify(data)}`
            );
        }
        // More
        return this;
    }

}