import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'Personalizat',
        MOD_NAME: 'Nume mod',
        AUTHOR: 'Nume autor',
        INSTALL_DATE: 'Data instalării',
    },
    sortDirection: {
        STANDARD: 'Standard',
        REVERSE: 'Invers',
    },
    sortLocalDisabledMods: {
        NONE: 'Niciuna',
        CUSTOM: 'Personalizat',
        FIRST: 'Primele',
        LAST: 'Ultimele',
    },
    sortingStyle: {
        DEFAULT: 'Implicit',
        LAST_UPDATED: 'Ultima actualizare',
        ALPHABETICAL: 'Alfabetic',
        DOWNLOADS: 'Număr de descărcări',
        RATING: 'Rating',
    },
    launchType: {
        AUTO: 'Auto',
        NATIVE: 'Nativ',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: 'Nume',
        LAST_UPDATED: 'Ultima actualizare'
    }
}
