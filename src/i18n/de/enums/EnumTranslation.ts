import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {

    sortNaming: {
        CUSTOM: 'Benutzerdefiniert',
        MOD_NAME: 'Mod-Name',
        AUTHOR: 'Autorenname',
        INSTALL_DATE: 'Installationsdatum',
    },
    sortDirection: {
        STANDARD: 'Standard',
        REVERSE: 'Umgekehrt',
    },
    sortLocalDisabledMods: {
        NONE: 'Keine',
        CUSTOM: 'Benutzerdefiniert',
        FIRST: 'Zuerst',
        LAST: 'Zuletzt',
    },
    sortingStyle: {
        DEFAULT: 'Standard',
        LAST_UPDATED: 'Zuletzt aktualisiert',
        ALPHABETICAL: 'Alphabetisch',
        DOWNLOADS: 'Anzahl der Downloads',
        RATING: 'Bewertung',
    },
    launchType: {
        AUTO: 'Automatisch',
        NATIVE: 'Nativ',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: 'Name',
        LAST_UPDATED: 'Zuletzt aktualisiert'
    }
}
