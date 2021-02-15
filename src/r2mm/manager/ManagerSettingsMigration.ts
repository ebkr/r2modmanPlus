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
import { ManagerSettingsInterface_Legacy } from './SettingsDexieStore';
import GameManager from 'src/model/game/GameManager';

export default class ManagerSettingsMigration {

    public static async migrate() {
        const fs = FsProvider.instance;
        const configPath = path.join(PathResolver.CONFIG_DIR);
        const configFile = path.join(configPath, "conf.yml");
        if (await fs.exists(configFile)) {
            try {
                const settings = await ManagerSettings.getSingleton(GameManager.activeGame);
                await settings.load();

                const parsedYaml = yaml.parse((await fs.readFile(configFile)).toString()) as ManagerSettingsInterface_Legacy;
                await settings.setGameDirectory(parsedYaml.riskOfRain2Directory || settings.getContext().gameSpecific.gameDirectory!);
                await settings.setLinkedFiles(parsedYaml.linkedFiles || settings.getContext().gameSpecific.linkedFiles);
                await settings.setProfile(parsedYaml.lastSelectedProfile || settings.getContext().gameSpecific.lastSelectedProfile);
                await settings.setSteamDirectory(parsedYaml.steamDirectory! || settings.getContext().global.steamDirectory!);
                settings.getContext().global.expandedCards = parsedYaml.expandedCards || settings.getContext().global.expandedCards;
                settings.getContext().global.darkTheme = parsedYaml.darkTheme || false;
                await settings.setLaunchParameters(parsedYaml.launchParameters || settings.getContext().gameSpecific.launchParameters);
                await settings.setIgnoreCache(parsedYaml.ignoreCache || settings.getContext().global.ignoreCache);
                await settings.setDataDirectory(parsedYaml.dataDirectory || settings.getContext().global.dataDirectory);
                await settings.setInstalledSortBy(parsedYaml.installedSortBy || settings.getContext().gameSpecific.installedSortBy);
                await settings.setInstalledSortDirection(parsedYaml.installedSortDirection || settings.getContext().gameSpecific.installedSortDirection);
                await settings.setInstalledDisablePosition(parsedYaml.installedDisablePosition || settings.getContext().gameSpecific.installedDisablePosition);
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
