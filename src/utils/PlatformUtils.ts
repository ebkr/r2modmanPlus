import InteractionProvider from "../providers/ror2/system/InteractionProvider";

export async function getProgramFilesX86Directory(): Promise<string> {
    const env = await InteractionProvider.instance.getEnvironmentVariables();
    return env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
}
