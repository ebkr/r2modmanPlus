import FsProvider from '../providers/generic/file/FsProvider';
import ConfigFile from '../model/file/ConfigFile';

export type ConfigurationFile = {
    filename: string;
    path: string;
    sections: ConfigurationSection[];
}

export type ConfigurationSection = {
    sectionName: string;
    entries: ConfigurationEntry[];
}

export type ConfigurationEntryDisplayType = 'input' | 'single-select' | 'multi-select' | 'boolean';
export type ConfigurationEntry = {
    entryName: string;
    commentLines: CommentLine[];
    // Value since last load
    cachedValue: string;
    // Can be modified but not saved to disk
    value: string;
    displayType: ConfigurationEntryDisplayType;
}

export type CommentLine = {
    isDescription: boolean;
    displayValue: string;
    rawValue: string;
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
            const name = entryInfo.shift()!.trim();
            const value = entryInfo.join("=").trim(); // Re-add separated "=" symbols.
            entries.push({
                entryName: name,
                value: value,
                cachedValue: value,
                commentLines: await buildComments(comments),
                displayType: await determineEntryDisplayType(comments),
            } as ConfigurationEntry);
            comments = [];
        }
    }
    return entries;
}

async function determineEntryDisplayType(comments: string[]): Promise<ConfigurationEntryDisplayType> {
    if (comments.findIndex(comment => comment.includes('# Setting type: Boolean')) >= 0) {
        return 'boolean';
    }
    if (comments.findIndex(comment => comment.includes('# Multiple values can be set at the same time by separating them with')) >= 0) {
        return 'multi-select';
    }
    if (comments.findIndex(comment => comment.includes('# Acceptable values:')) >= 0) {
        return 'single-select';
    }
    return 'input';
}

async function buildComments(comments: string[]): Promise<CommentLine[]> {
    return comments
        .filter(value => value.trim().substring(1).length > 0)
        .map((commentLine) => {
        if (commentLine.trim().startsWith("##")) {
            return {
                isDescription: true,
                displayValue: commentLine.trim().substring(2).trim(),
                rawValue: commentLine.trim()
            } as CommentLine;
        } else {
            return {
                isDescription: false,
                displayValue: commentLine.trim().substring(1).trim(),
                rawValue: commentLine.trim()
            } as CommentLine;
        }
    });
}

export function getSelectOptions(entry: ConfigurationEntry): string[] {
    if (entry.displayType === "boolean") {
        return ["true", "false"];
    }
    if (!['single-select', 'multi-select'].includes(entry.displayType)) {
        throw new Error(`Invalid display type for select options. Got ${entry.displayType} for entry: ${entry.entryName}`);
    }
    const acceptableValuesComment = entry.commentLines.find(value => value.rawValue.includes("# Acceptable values:"));
    if (!acceptableValuesComment) {
        throw new Error(`Could not find metadata comment for acceptable values on entry: ${entry.entryName}`);
    }
    return acceptableValuesComment.rawValue.substring("# Acceptable values: ".length).split(",").map(value => value.trim());
}

export async function saveConfigurationFile(configurationFile: ConfigurationFile) {
    let writeString = "";
    for (const section of configurationFile.sections) {
        if (section.sectionName.trim().length > 0) {
            writeString += `[${section.sectionName}]\n\n`;
        }
        for (let entry of section.entries) {
            const comments = entry.commentLines.map(value => value.rawValue).join("\n")
            writeString += `${comments}\n`
            writeString += `${entry.entryName} = ${entry.value}\n\n`;
        }
    }
    await FsProvider.instance.writeFile(configurationFile.path, writeString);
}
