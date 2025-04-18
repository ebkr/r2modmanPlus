import FsProvider from '../providers/generic/file/FsProvider';
import path from 'path';

export default class FileUtils {

    public static requireImage(image: string) {
        return require("../assets/images/game_selection/" + image);
    }

    public static async copyFileOrFolder(source: string, target: string) {
        if ((await FsProvider.instance.stat(source)).isFile()) {
            await FsProvider.instance.copyFile(source, target);
        } else {
            await FsProvider.instance.copyFolder(source, target);
        }
    }

    public static async ensureDirectory(dir: string) {
        const fs = FsProvider.instance;
        await fs.mkdirs(dir);
    }

    public static async emptyDirectory(dir: string) {
        const fs = FsProvider.instance;
        const files = await fs.readdir(dir);
        for (const filename of files) {
            const file = path.join(dir, filename);
            if ((await fs.lstat(file)).isDirectory()) {
                await this.emptyDirectory(file);
                await fs.rmdir(file);
            } else {
                await fs.unlink(file);
            }
        }
        return Promise.resolve();
    }

    // Obfuscates the Windows username if it's part of the path.
    public static hideWindowsUsername(dir: string) {
        const separator = dir.includes('/') ? '/' : '\\';
        return dir.replace(
            /([A-Za-z]:)[\\\/]Users[\\\/][^\\\/]+[\\\/]/,
            `$1${separator}Users${separator}***${separator}`
        );
    }

    public static humanReadableSize(bytes: number) {
        // NumberFormat renders GBs as BBs ("billion bytes") when using "byte" unit type.
        if (bytes > 999999999 && bytes < 1000000000000) {
            return `${(bytes / 1000000000).toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            })} GB`;
        }

        return Intl.NumberFormat("en", {
            notation: "compact",
            style: "unit",
            unit: "byte",
            unitDisplay: "narrow",
        }).format(bytes);
    };

    public static async recursiveRemoveDirectoryIfExists(dir: string) {
        const fs = FsProvider.instance;

        if (!(await fs.exists(dir)) || !(await fs.lstat(dir)).isDirectory()) {
            return;
        }

        await FileUtils.emptyDirectory(dir);
        await fs.rmdir(dir);
    }
}
