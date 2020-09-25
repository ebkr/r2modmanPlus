import * as fs from 'fs-extra';
import * as path from "path";
import ProfileProvider from '../../providers/ror2/model_implementation/ProfileProvider';

export default class ProfileImpl extends ProfileProvider {

    public ensureProfileDirectory(directory: string, profileName: string) {
        if (!fs.existsSync(path.join(directory, profileName))) {
            fs.mkdirsSync(path.join(directory, profileName));
        }
    }

}
