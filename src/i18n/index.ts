import langEn, { dateTimeFormat as enDateTimeFormat } from './en';
import langFr, { dateTimeFormat as frDateTimeFormat } from './fr';
import { PlatformMessageFormat } from './base/platforms/PlatformMessageFormat';
import { GameSelectionMessageFormat } from './base/pages/GameSelectionMessageFormat';
import { SplashMessageFormat } from './base/pages/SplashMessageFormat';
import { ProfileSelectionMessageFormat } from './base/pages/ProfileSelectionMessageFormat';
import { ManagerMessageFormat } from './base/pages/ManagerMessageFormat';

export default {
    'en': langEn,
    'fr': langFr,
};

export const datetimeFormats = {
    [langEn.metadata.locale]: enDateTimeFormat,
    [langFr.metadata.locale]: frDateTimeFormat,
};

// TODO - Use for language selection screens
export type MessageMetadata = {
    name: string;
    locale: string;
}

export type MessageFormat = {
    metadata: MessageMetadata;
    translations: {
        pages: {
            gameSelection: GameSelectionMessageFormat,
            splash: SplashMessageFormat,
            profileSelection: ProfileSelectionMessageFormat,
            manager: ManagerMessageFormat,
        },
        platforms: PlatformMessageFormat;
    }
}

export type DateTimeFormat = {
    short: {
        year: string;
        month: string;
        day: string;
    },
    long: {
        year: string;
        month: string;
        day: string;
        weekday: string;
        hour: string;
        minute: string;
        hour12?: string; // If unspecified then is OS locale dependent
    }
}
