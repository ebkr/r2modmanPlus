import { ConfigEditorEventImplementation, FetchAllConfigFilesType } from './ConfigEditorEventProviderImplementation';

export type ConfigEditorEventProvider = {
    fetchAllConfigFiles: ({ id }: FetchAllConfigFilesType, { version }: FetchAllConfigFilesType, { basePath }: FetchAllConfigFilesType, { fileCallback }: FetchAllConfigFilesType) => void;
}

let implementation: () => ConfigEditorEventProvider;

function getImplementation(): ConfigEditorEventProvider {
    if (!implementation) {
        return ConfigEditorEventImplementation;
    }
    return implementation();
}

export function provideConfigEditorEventProviderImplementation(provider: () => ConfigEditorEventProvider) {
    implementation = provider;
}

const ConfigEditorEventInstance: ConfigEditorEventProvider = {
    fetchAllConfigFiles: ({ id }: FetchAllConfigFilesType, { version }: FetchAllConfigFilesType, { basePath }: FetchAllConfigFilesType, { fileCallback }: FetchAllConfigFilesType) => getImplementation().fetchAllConfigFiles(id, version, basePath, fileCallback),
};

export default ConfigEditorEventInstance;
