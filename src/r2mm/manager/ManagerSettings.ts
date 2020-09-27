import * as path from 'path';
import fs from 'fs';
import * as yaml from 'yaml';
import R2Error from '../../model/errors/R2Error';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileWriteError from '../../model/errors/FileWriteError';
import YamlConvertError from '../../model/errors/Yaml/YamlConvertError';
import PathResolver from './PathResolver';
import FileUtils from '../utils/FileUtils';

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

    private _riskOfRain2Directory: string | null = null;
    private _steamDirectory: string | null = null;
    private _lastSelectedProfile: string = 'Default';
    private _funkyModeEnabled: boolean = false;
    private _expandedCards: boolean = false;
    private _legacyInstallMode: boolean = false;
    private _linkedFiles: string[] = [];
    private _darkTheme: boolean = false;
    private _launchParameters: string = '';
    private _ignoreCache: boolean = false;
    private _dataDirectory: string = PathResolver.APPDATA_DIR;

    public load(): R2Error | void {
        configPath = path.join(PathResolver.APPDATA_DIR, 'config');
        configFile = path.join(configPath, 'conf.yml');
        FileUtils.ensureDirectory(configPath);
        if (fs.existsSync(configFile)) {
            try {
                const parsedYaml = yaml.parse(fs.readFileSync(configFile).toString());
                this._riskOfRain2Directory = parsedYaml._riskOfRain2Directory;
                this._linkedFiles = parsedYaml._linkedFiles || [];
                this._lastSelectedProfile = parsedYaml._lastSelectedProfile;
                this._steamDirectory = parsedYaml._steamDirectory;
                this._expandedCards = parsedYaml._expandedCards || false;
                this._legacyInstallMode = parsedYaml._legacyInstallMode;
                this._darkTheme = parsedYaml._darkTheme;
                this._launchParameters = parsedYaml._launchParameters || '';
                this._ignoreCache = parsedYaml._ignoreCache || false;
                this._dataDirectory = parsedYaml._dataDirectory || PathResolver.APPDATA_DIR;
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


    get riskOfRain2Directory(): string | null {
        return this._riskOfRain2Directory;
    }

    get steamDirectory(): string | null {
        return this._steamDirectory;
    }

    get lastSelectedProfile(): string {
        return this._lastSelectedProfile;
    }

    get funkyModeEnabled(): boolean {
        return this._funkyModeEnabled;
    }

    get expandedCards(): boolean {
        return this._expandedCards;
    }

    get legacyInstallMode(): boolean {
        return this._legacyInstallMode;
    }

    get linkedFiles(): string[] {
        return this._linkedFiles;
    }

    get darkTheme(): boolean {
        return this._darkTheme;
    }

    get launchParameters(): string {
        return this._launchParameters;
    }

    get ignoreCache(): boolean {
        return this._ignoreCache;
    }

    get dataDirectory(): string {
        return this._dataDirectory;
    }

    public setRiskOfRain2Directory(dir: string): R2Error | void {
        this._riskOfRain2Directory = dir;
        return this.save();
    }

    public setSteamDirectory(dir: string): R2Error | void {
        this._steamDirectory = dir;
        return this.save();
    }

    public setLinkedFiles(linkedFiles: string[]): R2Error | void {
        this._linkedFiles = linkedFiles;
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
        this._lastSelectedProfile = profile;
        return this.save();
    }

    public setFunkyMode(enabled: boolean): R2Error | void {
        this._funkyModeEnabled = enabled;
        return this.save();
    }

    public expandCards(): R2Error | void {
        this._expandedCards = true;
        return this.save();
    }

    public collapseCards(): R2Error | void {
        this._expandedCards = false;
        return this.save();
    }

    public setLegacyInstallMode(enabled: boolean): R2Error | void {
        this._legacyInstallMode = enabled;
        return this.save();
    }

    public toggleDarkTheme(): R2Error | void {
        this._darkTheme = !this._darkTheme;
        return this.save();
    }

    public setLaunchParameters(launchParams: string): R2Error | void {
        this._launchParameters = launchParams;
        return this.save();
    }

    public setIgnoreCache(ignore: boolean): R2Error | void {
        this._ignoreCache = ignore;
        return this.save();
    }

    public setDataDirectory(dataDirectory: string): R2Error | void {
        this._dataDirectory = dataDirectory;
        return this.save();
    }
}
