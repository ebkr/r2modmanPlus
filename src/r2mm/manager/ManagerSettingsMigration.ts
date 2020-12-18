import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import * as yaml from 'yaml';
import R2Error from '../../model/errors/R2Error';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileWriteError from '../../model/errors/FileWriteError';
import YamlConvertError from '../../model/errors/Yaml/YamlConvertError';
import PathResolver from './PathResolver';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';
import EnumResolver from '../../model/enums/_EnumResolver';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import FileUtils from '../../utils/FileUtils';
import ManagerSettings from './ManagerSettings';
import set = Reflect.set;
import { ManagerSettingsInterface } from './SettingsDexieStore';

export default class ManagerSettingsMigration {

    public static async migrate() {
        const fs = FsProvider.instance;
        const configPath = path.join(PathResolver.CONFIG_DIR);
        const configFile = path.join(configPath, "conf.yml");
        if (await fs.exists(configFile)) {
            try {
                const settings = await ManagerSettings.getSingleton();
                await settings.load();

                const parsedYaml = yaml.parse((await fs.readFile(configFile)).toString()) as ManagerSettingsInterface;
                await settings.setRiskOfRain2Directory(parsedYaml.riskOfRain2Directory || settings.riskOfRain2Directory!);
                await settings.setLinkedFiles(parsedYaml.linkedFiles || settings.linkedFiles);
                await settings.setProfile(parsedYaml.lastSelectedProfile || settings.lastSelectedProfile);
                await settings.setSteamDirectory(parsedYaml.steamDirectory! || settings.steamDirectory!);
                settings.expandedCards = parsedYaml.expandedCards || settings.expandedCards;
                settings.darkTheme = parsedYaml.darkTheme || parsedYaml.darkTheme;
                await settings.setLaunchParameters(parsedYaml.launchParameters || settings.launchParameters);
                await settings.setIgnoreCache(parsedYaml.ignoreCache || settings.ignoreCache);
                await settings.setDataDirectory(parsedYaml.dataDirectory || settings.dataDirectory);
                await settings.setInstalledSortBy(parsedYaml.installedSortBy || settings.installedSortBy);
                await settings.setInstalledSortDirection(parsedYaml.installedSortDirection || settings.installedSortDirection);
                await settings.setInstalledDisablePosition(parsedYaml.installedDisablePosition || settings.installedDisablePosition);
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message,
                    'Did you modify the conf.yml file? If not, delete it, and re-launch the manager'
                );
            }
            try {
                await fs.unlink(configFile);
            } catch (e) {
                const err: Error = e;
                return new FileWriteError("Failed to migrate conf.yml", err.message, "Try running the manager as admin");
            }
        }
    }
}
