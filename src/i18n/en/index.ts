import { DateTimeFormat, MessageFormat } from '../index';
import {GameSelectionTranslation} from "./pages/GameSelectionTranslation";
import {SplashTranslation} from "./pages/SplashTranslation";
import {PlatformTranslation} from "./platforms/PlatformTranslation";
import {ProfileSelectionTranslation} from "./pages/ProfileSelectionTranslation";
import { ManagerTranslation } from './pages/ManagerTranslation';
import {EnumTranslation} from "./enums/EnumTranslation";
import {HelpTranslation} from './pages/HelpTranslation';
import {SettingsTranslation} from "./pages/SettingsTranslation";
import { ConfigEditorTranslation } from './pages/ConfigEditorTranslation';

const message: MessageFormat = {
    metadata: {
        name: 'English',
        locale: 'en-US'
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
        },
        platforms: PlatformTranslation,
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

// Exported separately to enforce validation on exported type
export default message;
