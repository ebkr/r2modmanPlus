import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';
import R2Error from 'src/model/errors/R2Error';
import YamlParseError from 'src/model/errors/Yaml/YamlParseError';
import FileWriteError from 'src/model/errors/FileWriteError';
import YamlConvertError from 'src/model/errors/Yaml/YamlConvertError';
import PathResolver from './PathResolver';

const configPath: string = path.join(PathResolver.ROOT, 'config');
const configFile: string = path.join(configPath, 'conf.yml');

export default class ManagerSettings {

    public riskOfRain2Directory: string | null = null;
    public steamDirectory: string | null = null;
    public lastSelectedProfile: string = 'Default';
    public funkyModeEnabled: boolean = false;
    public expandedCards: boolean = false;
    public legacyInstallMode: boolean = false;
    public linkedFiles: string[] = [];

    public load(): R2Error | void {
        if (!fs.pathExistsSync(configPath)) {
            fs.mkdirsSync(configPath);
        }
        if (fs.existsSync(configFile)) {
            try {
                const parsedYaml = yaml.parse(fs.readFileSync(configFile).toString());
                this.riskOfRain2Directory = parsedYaml.riskOfRain2Directory;
                this.linkedFiles = parsedYaml.linkedFiles;
                this.lastSelectedProfile = parsedYaml.lastSelectedProfile;
                this.steamDirectory = parsedYaml.steamDirectory;
                this.expandedCards = parsedYaml.expandedCards || false;
                this.legacyInstallMode = parsedYaml.legacyInstallMode;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message
                )
            }
        }
    }

    public setRiskOfRain2Directory(dir: string): R2Error | void {
        this.riskOfRain2Directory = dir;
        return this.save();
    }

    public setSteamDirectory(dir: string): R2Error | void {
        this.steamDirectory = dir;
        return this.save();
    }

    public setLinkedFiles(linkedFiles: string[]): R2Error | void {
        this.linkedFiles = linkedFiles;
        return this.save();
    }

    private save(): R2Error | void {
        try {
            const writeableYaml = yaml.stringify(this);
            try {
                fs.writeFileSync(configFile, writeableYaml);
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to write conf.yml',
                    err.message
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to write convert yaml',
                err.message
            )
        }
    }

    public setProfile(profile: string): R2Error | void {
        this.lastSelectedProfile = profile;
        return this.save();
    }

    public setFunkyMode(enabled: boolean): R2Error | void {
        this.funkyModeEnabled = enabled;
        return this.save();
    }

    public expandCards(): R2Error | void {
        this.expandedCards = true;
        return this.save();
    }

    public collapseCards(): R2Error | void {
        this.expandedCards = false;
        return this.save();
    }

    public setLegacyInstallMode(enabled: boolean): R2Error | void {
        this.legacyInstallMode = enabled;
        return this.save();
    }

}