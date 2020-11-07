import FsProvider from '../../providers/generic/file/FsProvider';
import * as path from "path";
import ProfileProvider from '../../providers/ror2/model_implementation/ProfileProvider';
import FileUtils from '../../utils/FileUtils';

export default class ProfileImpl extends ProfileProvider {

    public ensureProfileDirectory(directory: string, profileName: string) {
        const fs = FsProvider.instance;
        if (!fs.existsSync(path.join(directory, profileName))) {
            FileUtils.ensureDirectory(path.join(directory, profileName));
        }
    }

}
