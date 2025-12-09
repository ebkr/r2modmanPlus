import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: '自定义',
        MOD_NAME: '模组名',
        AUTHOR: '作者名',
        INSTALL_DATE: '安装时间',
    },
    sortDirection: {
        STANDARD: '标准',
        REVERSE: '反向',
    },
    sortLocalDisabledMods: {
        NONE: '无',
        CUSTOM: '自定义',
        FIRST: '最先',
        LAST: '最后',
    },
    sortingStyle: {
        DEFAULT: '默认',
        LAST_UPDATED: '最后更新',
        ALPHABETICAL: '字母顺序',
        DOWNLOADS: '下载量',
        RATING: '评分',
    },
    launchType: {
        AUTO: '自动',
        NATIVE: '原生',
        PROTON: 'Proton',
    }
}
