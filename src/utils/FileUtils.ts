import FsProvider from '../providers/generic/file/FsProvider';
import path from "path";

export default class FileUtils {

    public static ensureDirectory(dir: string) {
        const fs = FsProvider.instance;
        if (!fs.existsSync(dir)) {
            fs.mkdirsSync(dir);
        }
    }

    public static emptyDirectory(dir: string) {
        const fs = FsProvider.instance;
        const files = fs.readdirSync(dir);
        files.forEach(filename => {
            const file = path.join(dir, filename);
            if (fs.lstatSync(file).isDirectory()) {
                this.emptyDirectory(file);
                fs.rmdirSync(file);
            } else {
                fs.unlinkSync(file);
            }
        })
    }

}
