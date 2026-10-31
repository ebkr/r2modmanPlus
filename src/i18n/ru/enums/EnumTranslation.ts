import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'Пользовательская',
        MOD_NAME: 'Название мода',
        AUTHOR: 'Имя автора',
        INSTALL_DATE: 'Дата установки',
    },
    sortDirection: {
        STANDARD: 'Обычное',
        REVERSE: 'Обратное',
    },
    sortLocalDisabledMods: {
        NONE: 'Нет',
        CUSTOM: 'Пользовательская',
        FIRST: 'Сначала',
        LAST: 'В конце',
    },
    sortingStyle: {
        RELEVANCE: 'Релевантность',
        LAST_UPDATED: 'Последнее обновление',
        ALPHABETICAL: 'По алфавиту',
        DOWNLOADS: 'Число загрузок',
        RATING: 'Рейтинг',
    },
    launchType: {
        AUTO: 'Авто',
        NATIVE: 'Нативно',
        PROTON: 'Proton',
    },
    sortConfigFile: {
        NAME: 'Имя',
        LAST_UPDATED: 'Последнее обновление'
    }
}
