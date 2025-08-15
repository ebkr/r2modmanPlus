import ZipProvider from '../src/providers/generic/zip/ZipProvider';
import { NodeFsProvider} from '../src/providers/node/fs/fs';
import { NodePathProvider } from '../src/providers/node/path/path';
import { NodeOsProvider } from '../src/providers/node/os/os';
import { NodeChildProcessProvider } from '../src/providers/node/child_process/child_process';
import { NodeBufferProvider } from '../src/providers/node/buffer/buffer';

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
        }
    }
}

declare const __statics: any
