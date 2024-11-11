import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import R2Error from '../../model/errors/R2Error';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import LinkProvider from '../../providers/components/LinkProvider';
import FileUtils from '../../utils/FileUtils';
import Game from '../../model/game/Game';
import { StorePlatform } from '../../model/game/StorePlatform';


export class SteamInstallationValidator {

    public static async validateInstallation(game: Game): Promise<R2Error | void> {
        if (![StorePlatform.STEAM, StorePlatform.STEAM_DIRECT].includes(game.activePlatform.storePlatform)) {
            return new R2Error(
                "This feature is not available on non-Steam platforms.",
                "The feature deletes the contents of the game folder and verifies files. You can do the same manually."
            );
        }

        const gameFolder = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (gameFolder instanceof R2Error) {
            return gameFolder;
        }

        // Sanity check we're about to delete something resembling a valid game folder.
        let exeFound = false;
        for (let exeName of game.exeName) {
            if (await FsProvider.instance.exists(path.join(gameFolder, exeName))) {
                exeFound = true;
                break;
            }
        }

        if (!exeFound) {
            const message = game.exeName.length > 1 ?
                `Could not find any of "${game.exeName.join('", "')}"` :
                `Could not find "${game.exeName[0]}"`;

            return new R2Error(
                `${game.displayName} folder is invalid`,
                message,
                `Set the ${game.displayName} folder in the settings section`
            );
        }

        try {
            await FileUtils.emptyDirectory(gameFolder);
        } catch(e) {
            return R2Error.fromThrownValue(
                e,
                'Failed to empty the game folder',
                `Try launching ${ManagerInformation.APP_NAME} as an administrator`
            );
        }

        try {
            LinkProvider.instance.openLink(`steam://validate/${game.activePlatform.storeIdentifier}`);
        } catch(e) {
            return R2Error.fromThrownValue(e, 'Failed to start steam://validate');
        }
    }
}
