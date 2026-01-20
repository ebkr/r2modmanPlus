import GameRunnerProvider from '../../../../providers/generic/game/GameRunnerProvider';
import Game from '../../../../model/game/Game';
import R2Error from '../../../../model/errors/R2Error';
import Profile from '../../../../model/Profile';
import GameInstructions from '../../instructions/GameInstructions';
import GameInstructionParser from '../../instructions/GameInstructionParser';
import FsProvider from '../../../../providers/generic/file/FsProvider';
import { PackageLoader } from '../../../../model/schema/ThunderstoreSchema';
import { DynamicGameInstruction } from '../../instructions/DynamicGameInstruction';
import { getUnityDoorstopVersion } from '../../../../utils/UnityDoorstopUtils';
import path from '../../../../providers/node/path/path';
import ModLinker from '../../../../r2mm/manager/ModLinker';
import { buildConfigurationFileFromPath, saveConfigurationFile } from '../../../../utils/ConfigUtils';

export type EgsInstallationListEntry = {
    InstallLocation: string;
    NamespaceId: string;
    ItemId: string;
    ArtifactId: string;
    AppVersion: string;
    AppName: string;
}

export type EgsInstalledDataFormat = {
    InstallationList: EgsInstallationListEntry[];
}

export default class EgsGameRunner extends GameRunnerProvider {

    public async getGameArguments(game: Game, profile: Profile): Promise<string[] | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        return await GameInstructionParser.parseList(instructions.moddedParameterList, game, profile);
    }

    public async startModded(game: Game, profile: Profile): Promise<void | R2Error> {
        const args = await this.getGameArguments(game, profile);
        if (args instanceof R2Error) {
            return args
        }
        if (game.packageLoader === PackageLoader.BEPINEX) {
            await this.setDoorstopEnabled(profile, game, true);
        }
        await ModLinker.link(profile.asImmutableProfile(), game);
        return this.start(game, args);
    }

    public async startVanilla(game: Game, profile: Profile): Promise<void | R2Error> {
        const instructions = await GameInstructions.getInstructionsForGame(game, profile);
        if (game.packageLoader === PackageLoader.BEPINEX) {
            await this.setDoorstopEnabled(profile, game, false);
        }
        await ModLinker.link(profile.asImmutableProfile(), game);
        return this.start(game, instructions.vanillaParameterList);
    }

    async start(game: Game, args: string[]): Promise<void | R2Error> {
        try {
            // Ignore errors to allow Thunderstore Mod Manager build without errors
            // @ts-ignore
            const launchString = await this.getLaunchString(game);
            window.electron.openExternal(launchString);
        } catch (e) {
            const err: Error = e as Error;
            return new R2Error("Failed to start the game", err.message, null);
        }
    }

    private async getLaunchString(game: Game): Promise<string> {
        let namespaceId = "";
        let itemId = "";
        let artifactId = "";

        const fileContent = (await FsProvider.instance.readFile(path.join('C:', 'ProgramData', 'Epic', 'UnrealEngineLauncher', 'LauncherInstalled.dat'))).toString();
        const installedData: EgsInstalledDataFormat = JSON.parse(fileContent);

        try {
            const entry = installedData.InstallationList!.filter(value => value.AppName.toLowerCase() === game.activePlatform.storeIdentifier?.toLowerCase())[0]!;
            namespaceId = entry.NamespaceId;
            itemId = entry.ItemId;
            artifactId = entry.ArtifactId;
        } catch (e) {
            const err: Error = e as Error;
            throw new R2Error('Failed to read LauncherInstalled.dat', err.message);
        }

        const protocol = 'com.epicgames.launcher://apps/';
        const launchArgs = "?action=launch&silent=true";
        return `${protocol}${namespaceId}%3A${itemId}%3A${artifactId}${launchArgs}`;
    }

    private async setDoorstopEnabled(profile: Profile, game: Game, enabled: boolean): Promise<void> {
        const doorstopPath = profile.joinToProfilePath("doorstop_config.ini");
        if (!(await FsProvider.instance.exists(doorstopPath))) {
            return;
        }
        const doorstopConfigurationFile = await buildConfigurationFileFromPath(doorstopPath);
        const doorstopVersion = await getUnityDoorstopVersion(profile);

        const preloaderPath = await GameInstructionParser.parse(DynamicGameInstruction.BEPINEX_PRELOADER_PATH, game, profile);
        if (preloaderPath instanceof R2Error) {
            throw preloaderPath;
        }

        if (doorstopVersion === 3) {
            const unityDoorstopSection = doorstopConfigurationFile.sections.find(section => section.sectionName === 'UnityDoorstop')!;
            unityDoorstopSection.entries.find(entry => entry.entryName === 'targetAssembly')!.value = preloaderPath;
            unityDoorstopSection.entries.find(entry => entry.entryName === 'enabled')!.value = Boolean(enabled).toString();
        } else if (doorstopVersion === 4) {
            const generalDoorstopSection = doorstopConfigurationFile.sections.find(section => section.sectionName === 'General')!;
            generalDoorstopSection.entries.find(entry => entry.entryName === 'target_assembly')!.value = preloaderPath;
            generalDoorstopSection.entries.find(entry => entry.entryName === 'enabled')!.value = Boolean(enabled).toString();
        } else {
            throw new R2Error(
                "Unsupported Doorstop version",
                "The version of Unity Doorstop is unsupported. This is likely due to a BepInEx update.",
                "Either downgrade your BepInEx version or wait for a manager update"
            );
        }

        await saveConfigurationFile(doorstopConfigurationFile);
    }
}
