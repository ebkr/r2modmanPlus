import FsProvider from '../../providers/generic/file/FsProvider';
import * as path from "path";
import ProfileProvider from '../../providers/ror2/model_implementation/ProfileProvider';
import FileUtils from '../../utils/FileUtils';

export default class ProfileImpl extends ProfileProvider {

    public async ensureProfileDirectory(directory: string, profileName: string) {
        const fs = FsProvider.instance;
        if (!await fs.exists(path.join(directory, profileName))) {
            await FileUtils.ensureDirectory(path.join(directory, profileName));
        }
    }

}
