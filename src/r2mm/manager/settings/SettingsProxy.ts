import Game from '../../../model/game/Game';
import SettingsStore from '../../manager/settings/SettingsStore';
import { InternalGlobalSettingsStructure_V3 } from '../../manager/settings/structures/v3/GlobalSettingsStructure_V3';
import SettingsDexieStore, { ManagerSettingsInterfaceGame_V2 } from '../../manager/SettingsDexieStore';
import { InternalGameSettingsStructure_V3 } from '../../manager/settings/structures/v3/GameSettingsStructure_V3';

/**
 * Acts as a wrapper between legacy and modern {@link ManagerSettings} formats.
 * When all games have migrated then this file is likely no longer required. Worth keeping for future upgrades though?
 */
export default class SettingsProxy {

    // Determine games to keep using old format during slow rollout.
    // Ensure migration to copy old settings is created when game is no longer legacy.
    private static GAMES_USING_LEGACY_SETTINGS = ["ThunderstoreBeta", "RiskOfRain2Server", "DysonSphereProgram", "Valheim",
        "ValheimServer", "GTFO", "Outward", "TaleSpire", "H3VR", "ROUNDS", "Mechanica", "Muck", "BONEWORKS",
        "LethalLeagueBlaze", "Timberborn", "TotallyAccurateBattleSimulator", "NASB", "Inscryption", "Starsand", "TABS",
        "CatsAreLiquidABP", "PotionCraft", "NearlyDead", "AGAINST", "RogueTower", "HOTDS", "ForTheKing", "Subnautica",
        "SubnauticaBZ", "CoreKeeper", "Titanfall2"
    ];

    public static async getGlobalContext(game: Game): Promise<InternalGlobalSettingsStructure_V3> {
        const store = new SettingsStore();
        await store.init(game);
        return store.getContext().global;
    }

    public static async getGameContext(game: Game) {
        // Determine games to fetch context using old format during slow rollout.
        if (this.GAMES_USING_LEGACY_SETTINGS.includes(game.settingsIdentifier)) {
            const settings = new SettingsDexieStore(game);
            return await settings.getLatestGameSpecific();
        }
        // Game is not legacy, therefore use new settings.
        const store = new SettingsStore();
        await store.init(game);
        return store.getContext().gameSpecific;
    }

    public static async saveGlobalContext(game: Game, context: InternalGlobalSettingsStructure_V3) {
        const store = new SettingsStore();
        await store.init(game);

        // Get old settings data and upgrade global value
        const saveData = store.getContext();
        saveData.global = context;
        saveData.globalFormat.structure = context;

        return await store.saveAll(saveData);
    }

    public static async saveGameContext(game: Game, context: InternalGameSettingsStructure_V3 | ManagerSettingsInterfaceGame_V2) {
        // Determine games to save using old format during slow rollout.
        if (this.GAMES_USING_LEGACY_SETTINGS.includes(game.settingsIdentifier)) {
            const settings = new SettingsDexieStore(game);
            const saveData = await settings.getLatest();
            saveData.gameSpecific = context;
            return await settings.save(saveData);
        }
        // Game is not legacy, therefore use new settings.
        const store = new SettingsStore();
        await store.init(game);

        // Get old settings data and upgrade game specific value
        const saveData = store.getContext();
        saveData.gameSpecific = context;
        saveData.gameFormat.structure[game.settingsIdentifier] = context;

        return await store.saveAll(saveData);
    }

}
