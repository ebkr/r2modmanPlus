import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'Özel',
        MOD_NAME: 'Mod adı',
        AUTHOR: 'Yapımcı adı',
        INSTALL_DATE: 'Yükleme tarihi',
    },
    sortDirection: {
        STANDARD: 'Standart',
        REVERSE: 'Ters',
    },
    sortLocalDisabledMods: {
        NONE: 'Hiçbiri',
        CUSTOM: 'Özel',
        FIRST: 'Başta',
        LAST: 'Sonda',
    },
    sortingStyle: {
        RELEVANCE: 'İlgi düzeyi',
        LAST_UPDATED: 'Son güncelleme',
        ALPHABETICAL: 'Alfabetik',
        DOWNLOADS: 'İndirme sayısı',
        RATING: 'Puan',
    },
    launchType: {
        AUTO: 'Otomatik',
        NATIVE: 'Yerel',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: 'Ad',
        LAST_UPDATED: 'Son güncelleme'
    }
}
