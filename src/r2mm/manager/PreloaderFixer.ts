import GameDirectoryResolverProvider from '../../providers/ror2/game/GameDirectoryResolverProvider';
import R2Error from '../../model/errors/R2Error';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import LinkProvider from '../../providers/components/LinkProvider';
import FileUtils from '../../utils/FileUtils';
import Game from '../../model/game/Game';
import { StorePlatform } from '../../model/game/StorePlatform';

export default class PreloaderFixer {

    public static async fix(game: Game): Promise<R2Error | void> {
        if (![StorePlatform.STEAM, StorePlatform.STEAM_DIRECT].includes(game.activePlatform.storePlatform)) {
            return new R2Error(
                "PreloaderFix is not available on non-Steam platforms.",
                `The preloader fix deletes the ${path.join(game.dataFolderName, 'Managed')} folder and verifies files. You can do the same manually.`,
                null
            );
        }
        const fs = FsProvider.instance;
        const dirResult = await GameDirectoryResolverProvider.instance.getDirectory(game);
        if (dirResult instanceof R2Error)
            return dirResult;

        let exeFound = false;
        for(let exeName of game.exeName) {
            if (await fs.exists(path.join(dirResult, exeName))) {
                exeFound = true;
                break;
            }
        }

        if(!exeFound) {
            return new R2Error(`${game.displayName} directory is invalid`, `could not find either of "${game.exeName.join('", "')}"`,
                `Set the ${game.displayName} directory in the settings section`);
        }

        try {
            await FileUtils.emptyDirectory(path.join(dirResult, game.dataFolderName, 'Managed'));
            await fs.rmdir(path.join(dirResult, game.dataFolderName, 'Managed'));
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error('Failed to remove Managed directory', err.message, `Try launching ${ManagerInformation.APP_NAME} as an administrator`);
        }
        try {
            LinkProvider.instance.openLink(`steam://validate/${game.activePlatform.storeIdentifier}`);
        } catch(e) {
            const err: Error = e as Error;
            return new R2Error('Failed to start steam://validate', err.message, null);
        }
    }
}
