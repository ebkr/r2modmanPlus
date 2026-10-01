import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: '自定义',
        MOD_NAME: '模组名称',
        AUTHOR: '作者名称',
        INSTALL_DATE: '安装日期',
    },
    sortDirection: {
        STANDARD: '正序',
        REVERSE: '倒序',
    },
    sortLocalDisabledMods: {
        NONE: '无',
        CUSTOM: '自定义',
        FIRST: '最前',
        LAST: '最后',
    },
    sortingStyle: {
        RELEVANCE: '相关度',
        LAST_UPDATED: '最后更新',
        ALPHABETICAL: '字母顺序',
        DOWNLOADS: '下载量',
        RATING: '评分',
    },
    launchType: {
        AUTO: '自动',
        NATIVE: '原生',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: '名称',
        LAST_UPDATED: '最后更新'
    }
}

