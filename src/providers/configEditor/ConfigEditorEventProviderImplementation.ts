import { ConfigEditorEventProvider } from './ConfigEditorEventProvider';
import { PartialConfigurationFile } from 'src/utils/ConfigUtils';

export type FetchAllConfigFilesType = {
    id: number;
    version: number;
    basePath: string;
    fileCallback: (file: PartialConfigurationFile) => void;
}

export const ConfigEditorEventImplementation: ConfigEditorEventProvider = {
    fetchAllConfigFiles: ({ id }: FetchAllConfigFilesType, { version }: FetchAllConfigFilesType, { basePath }: FetchAllConfigFilesType, { fileCallback }: FetchAllConfigFilesType) => window.configEditor.fetchAllConfigFiles(id, version, basePath, fileCallback),
}
