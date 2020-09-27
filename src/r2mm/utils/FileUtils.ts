import fs from 'fs';

export default class FileUtils {

    public static ensureDirectory(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
    }

    public static emptyDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (fs.lstatSync(file).isDirectory()) {
                this.emptyDirectory(file);
                fs.rmdirSync(file);
            } else {
                fs.unlinkSync(file);
            }
        })
    }

}
