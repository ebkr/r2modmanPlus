import langEn, { dateTimeFormat as enDateTimeFormat } from './en';
import langFr, { dateTimeFormat as frDateTimeFormat } from './fr';
import langzhCN, { dateTimeFormat as zhCNDateTimeFormat } from './zh-CN';
import { PlatformMessageFormat } from './base/platforms/PlatformMessageFormat';
import { GameSelectionMessageFormat } from './base/pages/GameSelectionMessageFormat';
import { SplashMessageFormat } from './base/pages/SplashMessageFormat';
import { ProfileSelectionMessageFormat } from './base/pages/ProfileSelectionMessageFormat';
import { ManagerMessageFormat } from './base/pages/ManagerMessageFormat';
import {EnumMessageFormat} from "./base/enums/EnumMessageFormat";
import { HelpMessageFormat } from './base/pages/HelpMessageFormat';
import { SettingsMessageFormat } from './base/pages/SettingsMessageFormat';

export default {
    'en': langEn,
    'fr': langFr,
    'zh-CN': langzhCN,
};

export const datetimeFormats = {
    [langEn.metadata.locale]: enDateTimeFormat,
    [langFr.metadata.locale]: frDateTimeFormat,
    [langzhCN.metadata.locale]: zhCNDateTimeFormat,
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
            help: HelpMessageFormat,
            settings: SettingsMessageFormat,
        },
        platforms: PlatformMessageFormat;
        enums: EnumMessageFormat;
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
