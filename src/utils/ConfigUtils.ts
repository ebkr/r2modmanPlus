import FsProvider from "../providers/generic/file/FsProvider";
import ConfigFile from "../model/file/ConfigFile";

export type ConfigurationFile = {
    filename: string;
    path: string;
    sections: ConfigurationSection[];
}

export type ConfigurationSection = {
    sectionName: string;
    entries: ConfigurationEntry[];
}

export type ConfigurationEntry = {
    entryName: string;
    commentLines: CommentLine[];
    value: string;
}

export type CommentLine = {
    isDescription: boolean;
    displayValue: string;
}

export async function buildConfigurationFileFromPath(configFile: ConfigFile): Promise<ConfigurationFile> {
    const configFileData = (await FsProvider.instance.readFile(configFile.getPath())).toString();
    return {
        filename: configFile.getName(),
        path: configFile.getPath(),
        sections: await buildConfigurationSections(configFileData),
    };
}

async function buildConfigurationSections(configData: string): Promise<ConfigurationSection[]> {
    const lines = configData.split(/\r?\n/);
    let sectionLines: string[] = [];
    let section: ConfigurationSection = {
        sectionName: "",
        entries: [],
    };

    const configurationSections: ConfigurationSection[] = [section];

    for (const line of lines) {
        // For each new section listing, create a new corresponding type.
        // Update the entries for the old row being consumed prior to moving on.
        if (line.trim().startsWith("[")) {
            section.entries = await buildConfigurationEntries(sectionLines);
            section = {
                sectionName: line.trim().substring(1, line.trim().length - 1),
                entries: []
            }
            configurationSections.push(section);
            sectionLines = [];
        } else if (line.trim().length > 0) {
            sectionLines.push(line.trim());
        }
    }

    // End of the file, need to update the entries that were built up.
    section.entries = await buildConfigurationEntries(sectionLines);

    return configurationSections.filter(value => value.sectionName !== "");
}

async function buildConfigurationEntries(configLines: string[]): Promise<ConfigurationEntry[]> {
    const entries: ConfigurationEntry[] = [];
    let comments: string[] = [];
    for (const line of configLines) {
        if (line.trim().startsWith("#")) {
            comments.push(line);
        } else if (line.trim().length > 0 && line.indexOf("=") > 0) {
            const entryInfo = line.split("=");
            const name = entryInfo.shift();
            const value = entryInfo.join("="); // Re-add separated "=" symbols.
            entries.push({
                entryName: name,
                value: value,
                commentLines: await buildComments(comments),
            } as ConfigurationEntry);
            comments = [];
        }
    }
    return entries;
}

async function buildComments(comments: string[]): Promise<CommentLine[]> {
    return comments
        .filter(value => value.trim().substring(1).length > 0)
        .map((commentLine) => {
        if (commentLine.trim().startsWith("##")) {
            return {
                isDescription: true,
                displayValue: commentLine.trim().substring(2).trim(),
            } as CommentLine;
        } else {
            return {
                isDescription: false,
                displayValue: commentLine.trim().substring(1).trim(),
            } as CommentLine;
        }
    });
}
