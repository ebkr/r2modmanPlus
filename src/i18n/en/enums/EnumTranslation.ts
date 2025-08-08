import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'Custom',
        MOD_NAME: 'Mod name',
        AUTHOR: 'Author name',
        INSTALL_DATE: 'Install date',
    },
    sortDirection: {
        STANDARD: 'Standard',
        REVERSE: 'Reverse',
    },
    sortLocalDisabledMods: {
        NONE: 'None',
        CUSTOM: 'Custom',
        FIRST: 'First',
        LAST: 'Last',
    },
    sortingStyle: {
        DEFAULT: 'Default',
        LAST_UPDATED: 'Last updated',
        ALPHABETICAL: 'Alphabetical',
        DOWNLOADS: 'Download count',
        RATING: 'Rating',
    }
}
