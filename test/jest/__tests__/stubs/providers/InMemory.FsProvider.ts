import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import StatInterface from '../../../../../src/providers/generic/file/StatInterface';
import * as path from 'path';

type FileType = {name: string, type: "FILE" | "DIR", nodes: FileType[] | undefined, content: string | undefined, mtime: Date};


/**
 * (Poor) dummy implementation of the node FS library intended to be used for realistic tests.
 * Saves files from having to be written to disk during testing.
 *
 * Note that for all purposes, the path must contain a folder.
 * E.g. writing a file to the root of the file system won't work as expected.
 */
export default class InMemoryFsProvider extends FsProvider {

    private static files: FileType[] = [];
    private static matchMode: "CASE_SENSITIVE" | "CASE_INSENSITIVE" = "CASE_SENSITIVE";

    public static setMatchMode(matchMode: "CASE_SENSITIVE" | "CASE_INSENSITIVE") {
        InMemoryFsProvider.matchMode = matchMode;
    }

    public static clear() {
        InMemoryFsProvider.files = [];
        InMemoryFsProvider.matchMode = "CASE_SENSITIVE";
    }

    public static jsonFileStructure(): string {
        return JSON.stringify(this.files);
    }

    private findFileType(typePath: string, type?: "FILE" | "DIR"): FileType {
        let root = InMemoryFsProvider.files;
        let found: FileType | undefined;
        typePath.split(path.sep).forEach(value => {
            if (found === undefined) {
                found = root.find(value1 => {
                    switch(InMemoryFsProvider.matchMode) {
                        case 'CASE_SENSITIVE': return value1.name === value;
                        case 'CASE_INSENSITIVE': return value1.name.toLowerCase() === value.toLowerCase();
                        default: throw new Error("Unhandled match mode");
                    }
                })!;
            } else {
                found = (found.nodes || []).find(value1 => {
                    switch(InMemoryFsProvider.matchMode) {
                        case 'CASE_SENSITIVE': return value1.name === value;
                        case 'CASE_INSENSITIVE': return value1.name.toLowerCase() === value.toLowerCase();
                        default: throw new Error("Unhandled match mode");
                    }
                })!;
            }
        })
        if (type !== undefined && found!.type !== type) {
            throw new Error(`Types not matching, searched for ${type} but found ${found?.type} at path ${typePath}`);
        }
        if (found === undefined) {
            throw new Error("File type not found");
        }
        return found!;
    }

    private deepCopyDirFileType(typePath: string): FileType {
        const found = this.findFileType(typePath);
        const nodes: FileType[] = [];
        (found.nodes || []).forEach(value => {
            try {
                nodes.push(this.deepCopyDirFileType(path.join(typePath, value.name)));
            } catch (e) {
                // Do nothing, end of tree.
            }
        });
        return {
            type: found.type,
            content: found.content,
            name: found.name,
            nodes: nodes,
            mtime: found.mtime
        } as FileType
    }

    async base64FromZip(path: string): Promise<string> {
        return Promise.resolve('');
    }

    async chmod(path: string, mode: string | number): Promise<void> {
        return Promise.resolve();
    }

    async copyFile(from: string, to: string): Promise<void> {
        const source = this.findFileType(from, "FILE");
        const dest = this.findFileType(path.dirname(to), "DIR");
        const newNodes = (dest.nodes || []).filter(value => value.name !== path.basename(to));
        newNodes.push({
            name: path.basename(to),
            type: "FILE",
            content: source.content,
            mtime: new Date()
        } as FileType);
        dest.nodes = newNodes;
    }

    async copyFolder(from: string, to: string): Promise<void> {
        const dest = this.findFileType(path.dirname(to), "DIR");
        const newNodes = (dest.nodes || []).filter(value => value.name !== path.basename(to));
        const clonedFrom = this.deepCopyDirFileType(from);
        clonedFrom.name = path.basename(to);
        newNodes.push(clonedFrom);
        dest.nodes = newNodes;
    }

    async exists(path: string): Promise<boolean> {
        try {
            this.findFileType(path);
            return true;
        } catch (e) {
            return false;
        }
    }

    async lstat(path: string): Promise<StatInterface> {
        const found = this.findFileType(path);
        const res: StatInterface = {
            isDirectory: () => found.type === "DIR",
            isFile: () => found.type === "FILE",
            mtime: found.mtime,
            size: (found.content || "").length
        };
        return Promise.resolve(res);
    }

    async mkdirs(dirPath: string): Promise<void> {
        let root = InMemoryFsProvider.files;
        dirPath.split(path.sep).forEach(step => {
            const found = root.find(value => value.name === step);
            if (found === undefined) {
                const dir: FileType = {
                    name: step,
                    type: "DIR",
                    nodes: [],
                    content: undefined,
                    mtime: new Date()
                }
                root.push(dir);
                root = dir.nodes!;
            } else {
                root = found.nodes!;
            }
        });
    }

    async readFile(path: string): Promise<Buffer> {
        try {
            return Buffer.from(this.findFileType(path, "FILE").content!);
        } catch (e) {
            console.log(JSON.stringify(InMemoryFsProvider.files));
            throw e;
        }
    }

    async readdir(path: string): Promise<string[]> {
        const dir = this.findFileType(path, "DIR");
        return (dir.nodes || []).map(value => value.name);
    }

    async realpath(path: string): Promise<string> {
        return Promise.resolve(path);
    }

    async rename(oldPath: string, newPath: string): Promise<void> {
        if (
            !(await this.exists(oldPath)) ||
            !(await this.exists(path.dirname(newPath)))
        ) {
            throw new Error(`ENOENT: no such file or directory, rename '${oldPath}' -> '${newPath}'`);
        }

        if (path.dirname(oldPath) === "." || path.dirname(newPath) === ".") {
            throw new Error("InMemoryFsProvider doesn't support operations on root dir")
        }

        const copyOf = this.deepCopyDirFileType(oldPath);

        // Remove the target file/dir from the old parent directory.
        const parent = this.findFileType(path.dirname(oldPath), "DIR");
        parent.nodes = (parent.nodes || []).filter(value => value.name !== copyOf.name);

        // Rename the file/dir and place it in the new parent directory.
        const newParent = this.findFileType(path.dirname(newPath), "DIR");
        newParent.nodes = (newParent.nodes || []);
        copyOf.name = path.basename(newPath);
        newParent.nodes.push(copyOf);
    }

    async rmdir(dir: string): Promise<void> {
        const found = this.findFileType(dir, "DIR");
        const parent = this.findFileType(path.dirname(dir), "DIR");
        if ((found.nodes || []).length > 0) {
            throw new Error(`Folder is not empty, found ${JSON.stringify(found.nodes, null, 2)}`);
        }
        parent.nodes = (parent.nodes || []).filter(value => value.name !== found.name);
    }

    async stat(path: string): Promise<StatInterface> {
        return this.lstat(path);
    }

    async unlink(file: string): Promise<void> {
        const found = this.findFileType(file, "FILE");
        const parent = this.findFileType(path.dirname(file), "DIR");
        parent.nodes = (parent.nodes || []).filter(value => value.name !== found.name);
    }

    async writeFile(file: string, content: string | Buffer): Promise<void> {
        const newFile: FileType = {
            name: path.basename(file),
            nodes: undefined,
            content: content instanceof Buffer ? content.toString() : content,
            type: "FILE",
            mtime: new Date()
        }
        const parent = this.findFileType(path.dirname(file), "DIR");
        parent.nodes = (parent.nodes || []).filter(value => value.name !== newFile.name);
        parent.nodes.push(newFile);
    }


    async setModifiedTime(file: string, time: Date): Promise<void> {
        const found = this.findFileType(file);
        found.mtime = time;
    }
}
