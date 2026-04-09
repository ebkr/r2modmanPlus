import { defineBoot } from '#q-app/wrappers';
import { NodePathImplementation } from '../providers/node/path/NodePathImplementation';
import { providePathImplementation } from '../providers/node/path/path';
import { NodeChildProcessImplementation } from '../providers/node/child_process/ChildProcessImplementation';
import { provideChildProcessImplementation } from '../providers/node/child_process/child_process';
import { NodeOsImplementation } from '../providers/node/os/NodeOsImplementation';
import { provideOsImplementation } from '../providers/node/os/os';
import { NodeBufferImplementation } from '../providers/node/buffer/BufferImplementation';
import { provideBufferImplementation } from '../providers/node/buffer/buffer';
import { provideStoreImplementation } from '../providers/generic/store/StoreProvider';
import baseStore from '../store';
import FsProvider from '../providers/generic/file/FsProvider';
import { NodeFsImplementation } from '../providers/node/fs/NodeFsImplementation';
import ProfileProvider from '../providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from '../r2mm/model_implementation/ProfileImpl';
import LogOutput from '../r2mm/data/LogOutput';
import LogOutputProvider from '../providers/ror2/data/LogOutputProvider';
import ThunderstoreDownloaderProvider from '../providers/ror2/downloading/ThunderstoreDownloaderProvider';
import BetterThunderstoreDownloader from '../r2mm/downloading/BetterThunderstoreDownloader';
import ZipProvider from '../providers/generic/zip/ZipProvider';
import AdmZipProvider from '../providers/generic/zip/AdmZipProvider';
import LocalModInstallerProvider from '../providers/ror2/installing/LocalModInstallerProvider';
import LocalModInstaller from '../r2mm/installing/LocalModInstaller';
import ProfileInstallerProvider from '../providers/ror2/installing/ProfileInstallerProvider';
import GenericProfileInstaller from '../r2mm/installing/profile_installers/GenericProfileInstaller';
import LoggerProvider from '../providers/ror2/logging/LoggerProvider';
import { Logger } from '../r2mm/logging/Logger';
import LinkProvider from '../providers/components/LinkProvider';
import LinkImpl from '../r2mm/component_override/LinkImpl';
import InteractionProvider from '../providers/ror2/system/InteractionProvider';
import InteractionProviderImpl from '../r2mm/system/InteractionProviderImpl';
import { DataFolderProvider } from '../providers/ror2/system/DataFolderProvider';
import { DataFolderProviderImpl } from '../r2mm/system/DataFolderProviderImpl';
import PlatformInterceptorProvider from '../providers/generic/game/platform_interceptor/PlatformInterceptorProvider';
import PlatformInterceptorImpl from '../providers/generic/game/platform_interceptor/PlatformInterceptorImpl';
import { provideProtocolImplementation } from '../providers/generic/protocol/ProtocolProvider';
import { ProtocolProviderImplementation } from '../providers/generic/protocol/ProtocolProviderImplementation';
import BindLoaderImpl from '../providers/components/loaders/bind_impls/BindLoaderImpl';

export default defineBoot(() => {
    providePathImplementation(() => NodePathImplementation);
    provideChildProcessImplementation(() => NodeChildProcessImplementation);
    provideOsImplementation(() => NodeOsImplementation);
    provideBufferImplementation(() => NodeBufferImplementation);
    provideStoreImplementation(() => baseStore);
    FsProvider.provide(() => NodeFsImplementation);
    ProfileProvider.provide(() => new ProfileImpl());
    LogOutputProvider.provide(() => LogOutput.getSingleton());
    provideThunderstoreDownloadImplementation();
    ZipProvider.provide(() => new AdmZipProvider());
    LocalModInstallerProvider.provide(() => new LocalModInstaller());
    ProfileInstallerProvider.provide(() => new GenericProfileInstaller());
    LoggerProvider.provide(() => new Logger());
    LinkProvider.provide(() => new LinkImpl());
    InteractionProvider.provide(() => new InteractionProviderImpl());
    DataFolderProvider.provide(() => new DataFolderProviderImpl());
    PlatformInterceptorProvider.provide(() => new PlatformInterceptorImpl());
    provideProtocolImplementation(() => ProtocolProviderImplementation);

    BindLoaderImpl.bind();
});

function provideThunderstoreDownloadImplementation() {
    const betterThunderstoreDownloader = new BetterThunderstoreDownloader();
    ThunderstoreDownloaderProvider.provide(() => betterThunderstoreDownloader);
}
