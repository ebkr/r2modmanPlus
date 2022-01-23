import GameDirectoryResolverProvider from '../../../../ror2/game/GameDirectoryResolverProvider';
import Game from '../../../../../model/game/Game';
import R2Error from '../../../../../model/errors/R2Error';
import ManagerSettings from '../../../../../r2mm/manager/ManagerSettings';
import FsProvider from '../../../../../providers/generic/file/FsProvider';
import EgsInstallationListItem
    from '../../../../../providers/generic/game/directory_resolver/win/EgsInstallationListItem';
import * as path from 'path';

export default class EGSDirectoryResolver extends GameDirectoryResolverProvider {

    public async getDirectory(game: Game): Promise<string | R2Error> {
        const settings = await ManagerSettings.getSingleton(game);
        if (settings.getContext().gameSpecific.gameDirectory !== null) {
            return settings.getContext().gameSpecific.gameDirectory!;
        }
        /*
        EGS maintains a list of installed apps in:
        C:\ProgramData\Epic\UnrealEngineLauncher\LauncherInstalled.dat

        Unsure if there's a way to pull this information from the registry.
        */
        const datFilePath = path.join("C:", "ProgramData", "Epic", "UnrealEngineLauncher", "LauncherInstalled.dat");
        if (await FsProvider.instance.exists(datFilePath)) {
            try {
                const datBuffer = JSON.parse((await FsProvider.instance.readFile(datFilePath)).toString());
                const installationList = datBuffer.InstallationList as EgsInstallationListItem[];
                const gameMatch = installationList.find(value => value.AppName === game.activePlatform.storeIdentifier);
                if (gameMatch !== undefined) {
                    if (await FsProvider.instance.exists(gameMatch.InstallLocation)) {
                        return gameMatch.InstallLocation;
                    }
                }
            } catch (e) {
                return new R2Error(
                    `EGS LauncherInstalled.dat file is not valid JSON`,
                    "",
                    `Try manually locating the ${game.displayName} install directory through the settings`
                )
            }

        }
        return new R2Error(
            `Unable to resolve the ${game.displayName} install directory`,
            "",
            `Try manually locating the ${game.displayName} install directory through the settings`
        );
    }

    public async getSteamDirectory(): Promise<string | R2Error> {
        return new R2Error("Directory shouldn't be retrieved for a non-steam game", "", null);
    }

}
