import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: '커스텀',
        MOD_NAME: '모드 이름',
        AUTHOR: '제작자 이름',
        INSTALL_DATE: '설치 날짜',
    },
    sortDirection: {
        STANDARD: '기본',
        REVERSE: '역순',
    },
    sortLocalDisabledMods: {
        NONE: '숨기기',
        CUSTOM: '커스텀',
        FIRST: '맨 위로',
        LAST: '맨 아래로',
    },
    sortingStyle: {
        RELEVANCE: '관련성',
        LAST_UPDATED: '최신순',
        ALPHABETICAL: '알파벳순',
        DOWNLOADS: '다운로드 순',
        RATING: '평점순',
    },
    launchType: {
        AUTO: '자동',
        NATIVE: 'Native',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: '이름',
        LAST_UPDATED: '최신순'
    }
}
