import {SortLocalDisabledMods} from "src/model/real_enums/sort/SortLocalDisabledMods";

export type EnumMessageFormat = {
    sortNaming: {
        CUSTOM: string;
        MOD_NAME: string;
        AUTHOR: string;
        INSTALL_DATE: string;
    },
    sortDirection: {
        STANDARD: string;
        REVERSE: string;
    },
    sortLocalDisabledMods: {
        NONE: string;
        CUSTOM: string;
        FIRST: string;
        LAST: string;
    },
    sortingStyle: {
        DEFAULT: string;
        LAST_UPDATED: string;
        ALPHABETICAL: string;
        DOWNLOADS: string;
        RATING: string;
    },
    launchType: {
        AUTO: string;
        NATIVE: string;
        PROTON: string;
    },
    sortConfigFile: {
        NAME: string;
        LAST_UPDATED: string;
    }
}
