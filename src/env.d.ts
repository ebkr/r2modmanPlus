import ZipProvider from '../src/providers/generic/zip/ZipProvider';
import { NodeFsProvider} from '../src/providers/node/fs/fs';
import { NodePathProvider } from '../src/providers/node/path/path';
import { NodeOsProvider } from '../src/providers/node/os/os';
import { NodeChildProcessProvider } from '../src/providers/node/child_process/child_process';
import { NodeBufferProvider } from '../src/providers/node/buffer/buffer';
import { DirectoryTreeMessage } from '../src/providers/generic/file/DirectoryTreeProvider';
import {
    InteractionProviderFileProperties,
    InteractionProviderFolderProperties
} from './providers/ror2/system/InteractionProvider';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }

}

declare global {
    interface ImportMetaEnv {
        readonly MODE: string;
        readonly BASE_URL: string;
        readonly DEV: boolean;
        readonly PROD: boolean;
        readonly SSR: boolean;
        readonly [key: string]: any;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    interface Window {
        zip: {
            extractAllTo: (zip: string | Buffer, outputFolder: string) => Promise<void>;
            readFile: (zip: string | Buffer, file: string) => Promise<Buffer | null>;
            getEntries: (zip: string | Buffer) => Promise<ZipEntryInterface[]>;
            extractEntryTo: (zip: string | Buffer, target: string, outputPath: string) => Promise<void>;
            zipBuilder: () => ZipBuilder;
            createNewTemporaryZip: () => number;
            addBufferToTemporaryZip: (id: number, fileName: string, buffer: Buffer) => Promise<void>;
            addFolderToTemporaryZip: (id: number, zippedFolderName: string, folderName: string) => Promise<void>;
            finalizeTemporaryZip: (id: number, outputPath: string) => Promise<void>;
        },
        node: {
            fs: NodeFsProvider,
            path: NodePathProvider,
            os: NodeOsProvider,
            child_process: NodeChildProcessProvider
            buffer: NodeBufferProvider
        },
        app: {
            checkForApplicationUpdates: () => Promise<void>;
            getPlatform: () => string;
            restart: () => void;
            hookModInstallProtocol: (callback: (data: any) => void) => void;
            getAppDataDirectory: () => Promise<string>;
            isApplicationPortable: () => Promise<boolean>;
            getStaticsDirectory: () => string;
        },
        electron: {
            selectFolderDialog: (opt: InteractionProviderFolderProperties) => Promise<string[]>;
            selectFileDialog: (opt: InteractionProviderFileProperties) => Promise<string[]>;
            copyToClipboard: (value: string) => void;
            openPath: (path: string) => void;
            openExternal: (path: string) => void;
            selectFile: (path: string) => void;
            getEnvironmentVariables: () => Promise<string>;
        },
        directoryTree: {
            readDirectoryTree: (id: number, rootPath: string, messageCallback: (message: DirectoryTreeMessage) => void) => void;
        }
    }
}

declare const __statics: any
