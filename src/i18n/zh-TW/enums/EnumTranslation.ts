import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: '自訂',
        MOD_NAME: '模組名稱',
        AUTHOR: '作者名稱',
        INSTALL_DATE: '安裝日期',
    },
    sortDirection: {
        STANDARD: '標準',
        REVERSE: '反向',
    },
    sortLocalDisabledMods: {
        NONE: '無',
        CUSTOM: '自訂',
        FIRST: '置頂',
        LAST: '置底',
    },
    sortingStyle: {
        RELEVANCE: '相關度',
        LAST_UPDATED: '最後更新',
        ALPHABETICAL: '字母順序',
        DOWNLOADS: '下載量',
        RATING: '評分',
    },
    launchType: {
        AUTO: '自動',
        NATIVE: '原生',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: '名稱',
        LAST_UPDATED: '最後更新',
    }
}
