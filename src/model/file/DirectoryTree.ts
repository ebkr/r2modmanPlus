import DirectoryTreeProvider, { DirectoryTreeEntry, DirectoryTreeReadError } from '../../providers/generic/file/DirectoryTreeProvider';
import path from '../../providers/node/path/path';
import R2Error from '../errors/R2Error';

type DirectoryTreeFile = {
    path: string;
    size: number;
}

export default class DirectoryTree {

    private files: DirectoryTreeFile[] = [];
    private directories: DirectoryTree[] = [];
    private directoryName: string = '';
    private target: string = '';

    public static async buildFromLocation(location: string): Promise<DirectoryTree | R2Error> {
        const root = new DirectoryTree();
        root.target = location;
        root.directoryName = path.basename(location);

        const directoryIndex = new Map<string, DirectoryTree>();
        directoryIndex.set('', root);

        function addEntry(entry: DirectoryTreeEntry) {
            const parent = directoryIndex.get(entry.parentRelative) ?? root;
            if (entry.directory) {
                const directory = new DirectoryTree();
                directory.target = entry.path;
                directory.directoryName = entry.name;
                parent.directories.push(directory);
                directoryIndex.set(entry.relative, directory);
            } else {
                parent.files.push({ path: entry.path, size: entry.size });
            }
        }

        try {
            await DirectoryTreeProvider.instance.readRecursively(location, entries => entries.forEach(addEntry));
        } catch (e) {
            if (e instanceof DirectoryTreeReadError && e.code === 'ENOENT') {
                return new R2Error(
                    `File vanished while reading folder: ${path.dirname(e.path)}`,
                    `Expected to find '${path.basename(e.path)}' but it had been removed by the time the manager tried to read it.`,
                    'This is typically caused by antivirus software or another process removing / moving files while the manager is reading them.'
                );
            }
            const err: Error = e as Error;
            return new R2Error(
                `Error reading folder in DirectoryTree build for folder: ${location}`,
                err.message,
                'Relaunch the manager as admin, folder failed to be read.'
            );
        }

        return root;
    }

    public removeFiles(...args: string[]) {
        this.files = this.files.filter(value => !args.map(arg => arg.toLowerCase()).includes(value.path.toLowerCase()));
    }

    public removeFilesWithBasename(...args: string[]) {
        this.files = this.files.filter(value => !args.map(arg => arg.toLowerCase()).includes(path.basename(value.path).toLowerCase()));
    }

    public removeDirectories(...args: string[]) {
        this.directories = this.directories.filter(value => !args.map(arg => arg.toLowerCase()).includes(value.getDirectoryName().toLowerCase()));
    }

    public navigateAndPerform(onFound: (directoryTree: DirectoryTree) => void, ...args: string[]) {
        const dir = this.navigate(...args);
        if (dir !== undefined) {
            onFound(dir);
        }
    }

    public navigate(...args: string[]): DirectoryTree | undefined {
        const next = args[0];
        if (next !== undefined) {
            const foundDir = this.directories.find(value => value.directoryName.toLowerCase() === next.toLowerCase());
            if (foundDir !== undefined) {
                return foundDir.subNavigate(...args.slice(1));
            }
        }
    }

    private subNavigate(...args: string[]): DirectoryTree | undefined {
        const next = args[0];
        if (next !== undefined) {
            const foundDir = this.directories.find(value => value.directoryName.toLowerCase() === next.toLowerCase());
            if (foundDir !== undefined) {
                return foundDir.subNavigate(...args.slice(1));
            }
        } else {
            return this;
        }
    }

    public getFiles(): string[] {
        return this.files.map(file => file.path);
    }

    public getRecursiveFiles(): string[] {
        const files = this.getFiles();
        this.directories.forEach(tree => {
            files.push(...tree.getRecursiveFiles());
        });
        return files;
    }

    public getDirectories(): DirectoryTree[] {
        return this.directories;
    }

    public getDirectoryName(): string {
        return this.directoryName;
    }

    public getTarget(): string {
        return this.target;
    }

    public getSize(): number {
        return this.files.reduce((total, file) => total + file.size, 0)
            + this.directories.reduce((total, tree) => total + tree.getSize(), 0);
    }

}
