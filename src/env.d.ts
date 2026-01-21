import ZipProvider from '../src/providers/generic/zip/ZipProvider';
import { NodeFsProvider} from '../src/providers/node/fs/fs';
import { NodePathProvider } from '../src/providers/node/path/path';
import { NodeOsProvider } from '../src/providers/node/os/os';
import { NodeChildProcessProvider } from '../src/providers/node/child_process/child_process';
import { NodeBufferProvider } from '../src/providers/node/buffer/buffer';
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
    interface Window {
        zip: ZipProvider,
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
            getEnvironmentVariables: () => Record<string, string>;
            onCleanupRequest: (callback: () => void) => (() => void);
            signalCleanupComplete: () => void;
        }
    }
}

declare const __statics: any
