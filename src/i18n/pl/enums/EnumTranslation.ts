import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {

    sortNaming: {
        CUSTOM: 'Niestandardowe',
        MOD_NAME: 'Nazwa moda',
        AUTHOR: 'Nazwa autora',
        INSTALL_DATE: 'Data instalacji',
    },

    sortDirection: {
        STANDARD: 'A-Z',
        REVERSE: 'Z-A',
    },

    sortLocalDisabledMods: {
        NONE: 'Ukryte',
        CUSTOM: 'Niestandardowo',
        FIRST: 'Na początku',
        LAST: 'Na końcu',
    },

    sortingStyle: {
        DEFAULT: 'Domyślnie',
        LAST_UPDATED: 'Ostatnia aktualizacja',
        ALPHABETICAL: 'Alfabetycznie',
        DOWNLOADS: 'Liczba pobrań',
        RATING: 'Ocena',
    },

    launchType: {
        AUTO: 'Automatyczne',
        NATIVE: 'Natywne',
        PROTON: 'Proton',
    },

    sortConfigFile: {
        NAME: 'Nazwa',
        LAST_UPDATED: 'Ostatnia aktualizacja'
    }

}
