import ConfigLine from '../model/file/ConfigLine';
import FsProvider from '../providers/generic/file/FsProvider';
import ConfigFile from '../model/file/ConfigFile';
import * as path from 'path';

export default class BepInExConfigUtils {

    public static async getConfigFileInstance(file: string): Promise<ConfigFile> {
        const fs = FsProvider.instance;
        const fileStat = await fs.lstat(file);
        const filePathSplit = file.split(path.sep);
        filePathSplit.pop();
        return new ConfigFile(file.substring(path.join(...filePathSplit).length + 1, file.length - 4), file, fileStat.mtime);
    }

    public static async getBepInExConfigBreakdown(file: string): Promise<{ [section: string]: { [variable: string]: ConfigLine } }> {
        const fs = FsProvider.instance;
        const configFile = await this.getConfigFileInstance(file);
        const fileText = (await fs.readFile(configFile.getPath())).toString();

        // Find all variables offered within config script.
        const dumpedConfigVariables: { [section: string]: { [variable: string]: ConfigLine } } = {};
        let section = 'root';
        let comments: string[] = [];
        const allowedValues: Set<String> = new Set();
        fileText.split('\n').forEach((line: string) => {
            if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                section = line.trim().substring(1, line.trim().length - 1);
                dumpedConfigVariables[section] = {};
                comments = [];
            } else if (!line.trim().startsWith('#') && line.indexOf('=') > 0) {
                const sides = line.split('=');
                const rightSide = sides.splice(1).join("=");
                if (comments.find(value => value.trim().startsWith("# Setting type: Boolean"))) {
                    if (allowedValues.size === 0) {
                        allowedValues.add("true");
                        allowedValues.add("false");
                    }
                }
                const finalAcceptableValues: string[] = [];
                allowedValues.forEach(value => {
                    finalAcceptableValues.push(value.toString());
                })
                dumpedConfigVariables[section][sides[0].trim()] = new ConfigLine(rightSide.trim(), comments, finalAcceptableValues);
                comments = [];
                allowedValues.clear();
            } else if (line.trim().startsWith('#')) {
                comments.push(line.trim());
            }
        });
        return dumpedConfigVariables;
    }

    public static async updateBepInExConfigFile(file: string, originalText: string, data: { [section: string]: { [variable: string]: ConfigLine } }) {
        const fs = FsProvider.instance;
        let builtString = '';
        let section = 'root';
        originalText.split('\n').forEach((line: string) => {
            if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
                section = line.trim().substring(1, line.trim().length - 1);
                builtString += line + '\n';
            } else if (!line.trim().startsWith('#') && line.indexOf('=') > 0) {
                const sides = line.split('=');
                builtString += `${sides[0].trim()} = ${data[section][sides[0].trim()].value}\n`;
            } else {
                builtString += line + '\n';
            }
        });
        const configFile = await this.getConfigFileInstance(file);
        await fs.writeFile(configFile.getPath(), builtString.trim());
    }

}
