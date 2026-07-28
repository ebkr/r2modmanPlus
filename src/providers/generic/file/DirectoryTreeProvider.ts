import ProviderUtils from '../ProviderUtils';

export type DirectoryTreeEntry = {
    name: string;
    path: string;
    relative: string;
    parentRelative: string;
    directory: boolean;
    size: number;
}

export type DirectoryTreeMessage =
    | { type: 'entries', entries: DirectoryTreeEntry[] }
    | { type: 'end' }
    | { type: 'error', message: string, path: string, code?: string | undefined };


export class DirectoryTreeReadError extends Error {

    public readonly path: string;
    public readonly code: string | undefined;

    public constructor(message: string, path: string, code?: string) {
        super(message);
        this.name = 'DirectoryTreeReadError';
        this.path = path;
        this.code = code;
    }

}

export default abstract class DirectoryTreeProvider {

    private static provider: () => DirectoryTreeProvider;
    static provide(provided: () => DirectoryTreeProvider): void {
        this.provider = provided;
    }

    public static get instance(): DirectoryTreeProvider {
        if (DirectoryTreeProvider.provider === undefined) {
            ProviderUtils.throwNotProvidedError("DirectoryTreeProvider");
        }
        return DirectoryTreeProvider.provider();
    }

    public abstract readRecursively(rootPath: string, entryCallback: (entries: DirectoryTreeEntry[]) => void): Promise<void>;

}
