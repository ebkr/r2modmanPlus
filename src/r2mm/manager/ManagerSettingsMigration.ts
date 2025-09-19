import FsProvider from '../../providers/generic/file/FsProvider';
import * as yaml from 'yaml';
import YamlParseError from '../../model/errors/Yaml/YamlParseError';
import FileWriteError from '../../model/errors/FileWriteError';
import PathResolver from './PathResolver';
import ManagerSettings from './ManagerSettings';
import { ManagerSettingsInterface_Legacy } from './SettingsDexieStore';
import GameManager from '../../model/game/GameManager';
import path from '../../providers/node/path/path';

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
                const err: Error = e as Error;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message,
                    'Did you modify the conf.yml file? If not, delete it, and re-launch the manager'
                );
            }
            try {
                await fs.unlink(configFile);
            } catch (e) {
                const err: Error = e as Error;
                return new FileWriteError("Failed to migrate conf.yml", err.message, "Try running the manager as admin");
            }
        }
    }
}
