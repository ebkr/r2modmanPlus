import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'カスタム',
        MOD_NAME: 'Mod名',
        AUTHOR: '作者',
        INSTALL_DATE: 'インストール日時',
    },
    sortDirection: {
        STANDARD: '昇順',
        REVERSE: '降順',
    },
    sortLocalDisabledMods: {
        NONE: 'なし',
        CUSTOM: 'カスタム',
        FIRST: '冒頭',
        LAST: '末尾',
    },
    sortingStyle: {
        RELEVANCE: '関連性',
        LAST_UPDATED: '最終更新日',
        ALPHABETICAL: 'アルファベット順',
        DOWNLOADS: 'ダウンロード数',
        RATING: '評価数',
    },
    launchType: {
        AUTO: 'オート',
        NATIVE: 'ネイティブ',
        PROTON: 'プロトン',
    },
    sortConfigFile: {
        NAME: '名前',
        LAST_UPDATED: '最終更新日'
    }
}
