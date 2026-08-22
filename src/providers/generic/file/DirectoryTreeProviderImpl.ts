import DirectoryTreeProvider, { DirectoryTreeEntry, DirectoryTreeReadError } from './DirectoryTreeProvider';

let readIdentifier = 0;

export default class DirectoryTreeProviderImpl extends DirectoryTreeProvider {

    public readRecursively(rootPath: string, entryCallback: (entries: DirectoryTreeEntry[]) => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.directoryTree.readDirectoryTree(readIdentifier++, rootPath, message => {
                switch (message.type) {
                    case 'entries':
                        entryCallback(message.entries);
                        break;
                    case 'end':
                        resolve();
                        break;
                    case 'error':
                        reject(new DirectoryTreeReadError(message.message, message.path, message.code));
                        break;
                }
            });
        });
    }

}
