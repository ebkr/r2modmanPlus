import langEn from './en';
import langFr from './fr';
import { PlatformMessageFormat } from './base/platforms/PlatformMessageFormat';
import { GameSelectionMessageFormat } from './base/pages/GameSelectionMessageFormat';
import { SplashMessageFormat } from './base/pages/SplashMessageFormat';

export default {
    'en': langEn,
    'fr': langFr,
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
        },
        platforms: PlatformMessageFormat;
    }
}
