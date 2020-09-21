import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';
import R2Error from '../../model/errors/R2Error';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileWriteError from '../../model/errors/FileWriteError';
import YamlConvertError from '../../model/errors/Yaml/YamlConvertError';
import PathResolver from './PathResolver';

let configPath = '';
let configFile = '';

export default class ManagerSettings {

    private static LOADED_SETTINGS: ManagerSettings | undefined;

    public static getSingleton(): ManagerSettings {
        if (this.LOADED_SETTINGS === undefined) {
            this.LOADED_SETTINGS = new ManagerSettings();
            this.LOADED_SETTINGS.load();
        }
        return this.LOADED_SETTINGS;
    }

    public riskOfRain2Directory: string | null = null;
    public steamDirectory: string | null = null;
    public lastSelectedProfile: string = 'Default';
    public funkyModeEnabled: boolean = false;
    public allIconDisplayMode: boolean = false;
    public legacyInstallMode: boolean = false;
    public linkedFiles: string[] = [];
    public darkTheme: boolean = false;
    public launchParameters: string = '';
    public ignoreCache: boolean = false;
    public dataDirectory: string = PathResolver.APPDATA_DIR;

    public load(): R2Error | void {
        configPath = path.join(PathResolver.APPDATA_DIR, 'config');
        configFile = path.join(configPath, 'conf.yml');
        fs.ensureDirSync(configPath);
        if (fs.existsSync(configFile)) {
            try {
                const parsedYaml = yaml.parse(fs.readFileSync(configFile).toString());
                this.riskOfRain2Directory = parsedYaml.riskOfRain2Directory;
                this.linkedFiles = parsedYaml.linkedFiles || [];
                this.lastSelectedProfile = parsedYaml.lastSelectedProfile;
                this.steamDirectory = parsedYaml.steamDirectory;
                this.allIconDisplayMode = parsedYaml.allIconDisplayMode || false;
                this.legacyInstallMode = parsedYaml.legacyInstallMode;
                this.darkTheme = parsedYaml.darkTheme;
                this.launchParameters = parsedYaml.launchParameters || '';
                this.ignoreCache = parsedYaml.ignoreCache || false;
                this.dataDirectory = parsedYaml.dataDirectory || PathResolver.APPDATA_DIR;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message,
                    'Did you modify the conf.yml file? If not, delete it, and re-launch the manager'
                );
            }
        } else {
            this.save();
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
                    err.message,
                    'Try running r2modman as an administrator'
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to write convert yaml',
                err.message,
                null
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

    public setIconDisplayModeAll (): R2Error | void {
        this.allIconDisplayMode = true;
        return this.save();
    }

    public setIconDisplayModeReduced (): R2Error | void {
        this.allIconDisplayMode = false;
        return this.save();
    }

    public setLegacyInstallMode(enabled: boolean): R2Error | void {
        this.legacyInstallMode = enabled;
        return this.save();
    }

    public toggleDarkTheme(): R2Error | void {
        this.darkTheme = !this.darkTheme;
        return this.save();
    }

    public setLaunchParameters(launchParams: string): R2Error | void {
        this.launchParameters = launchParams;
        return this.save();
    }

    public setIgnoreCache(ignore: boolean): R2Error | void {
        this.ignoreCache = ignore;
        return this.save();
    }

    public setDataDirectory(dataDirectory: string): R2Error | void {
        this.dataDirectory = dataDirectory;
        return this.save();
    }
}
