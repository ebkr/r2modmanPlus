// This is just an example,
// so you can safely delete all default props below

import { MessageFormat } from '../index';
import {GameSelectionTranslation} from "./pages/GameSelectionTranslation";
import {SplashTranslation} from "./pages/SplashTranslation";
import {PlatformTranslation} from "./platforms/PlatformTranslation";
import {ProfileSelectionTranslation} from "./pages/ProfileSelectionTranslation";

const message: MessageFormat = {
    metadata: {
        name: 'English',
        locale: 'en'
    },
    translations: {
        pages: {
            gameSelection: GameSelectionTranslation,
            splash: SplashTranslation,
            profileSelection: ProfileSelectionTranslation
        },
        platforms: PlatformTranslation
    }
};

// Exported separately to enforce validation on exported type
export default message;
