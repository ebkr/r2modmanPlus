import { DateTimeFormat, MessageFormat } from '../index';
import { GameSelectionTranslation } from "./pages/GameSelectionTranslation";
import { SplashTranslation } from "./pages/SplashTranslation";
import { PlatformTranslation } from "./platforms/PlatformTranslation";
import { ModListStatusTranslation } from './modListStatus/ModListStatusTranslation';
import { BannerTranslation } from './banners/BannerTranslation';
import { ModalTranslation } from './modals/ModalTranslation';
import { ProfileSelectionTranslation } from "./pages/ProfileSelectionTranslation";
import { ManagerTranslation } from './pages/ManagerTranslation';
import { EnumTranslation } from "./enums/EnumTranslation";
import { HelpTranslation } from './pages/HelpTranslation';
import { SettingsTranslation } from "./pages/SettingsTranslation";
import { ConfigEditorTranslation } from './pages/ConfigEditorTranslation';
import { DownloadMonitorTranslation } from './pages/DownloadMonitorTranslation';
import { LinuxSetupTranslation } from './pages/LinuxSetupTranslation';
import { Error404Translation } from './pages/Error404Translation';

const message: MessageFormat = {
    metadata: {
        name: 'Română',
        locale: 'ro-RO'
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
            linuxSetup: LinuxSetupTranslation,
            error404: Error404Translation
        },
        platforms: PlatformTranslation,
        modListStatus: ModListStatusTranslation,
        banners: BannerTranslation,
        modals: ModalTranslation,
        enums: EnumTranslation,
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

// Exported separately to enforce validation on the exported type
export default message;
