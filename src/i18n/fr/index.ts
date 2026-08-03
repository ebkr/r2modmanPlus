import {GameSelectionTranslation} from "./pages/GameSelectionTranslation";
import {SplashTranslation} from "./pages/SplashTranslation";
import {PlatformTranslation} from "./platforms/PlatformTranslation";
import { ModListStatusTranslation } from './modListStatus/ModListStatusTranslation';
import { BannerTranslation } from './banners/BannerTranslation';
import {ProfileSelectionTranslation} from "./pages/ProfileSelectionTranslation";
import {ManagerTranslation} from './pages/ManagerTranslation';
import { DateTimeFormat } from 'src/i18n';
import { EnumTranslation } from './enums/EnumTranslation';
import { HelpTranslation } from './pages/HelpTranslation';
import { SettingsTranslation } from './pages/SettingsTranslation';
import { ConfigEditorTranslation } from './pages/ConfigEditorTranslation';
import { DownloadMonitorTranslation } from './pages/DownloadMonitorTranslation';

const message = {
    metadata: {
        name: 'Français',
        locale: 'fr-FR'
    },
    translations: {
        pages: {
            gameSelection: GameSelectionTranslation,
            splash: SplashTranslation,
            profileSelection: ProfileSelectionTranslation,
            manager: ManagerTranslation,
            help: HelpTranslation,
            settings: SettingsTranslation,
            configEditor: ConfigEditorTranslation,
            downloadMonitor: DownloadMonitorTranslation,
        },
        platforms: PlatformTranslation,
        modListStatus: ModListStatusTranslation,
        banners: BannerTranslation,
        enums: EnumTranslation
    }
};

export const dateTimeFormat: DateTimeFormat = {
    short: {
        year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
    },
}

// Exported separately to enforce validation on exported type
export default message;
