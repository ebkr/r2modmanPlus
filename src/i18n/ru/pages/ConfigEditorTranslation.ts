import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Редактор конфигов',
        subtitle: 'Выберите файл конфигурации для редактирования'
    },
    warning: {
        content: 'Файлы конфигурации создаются после хотя бы одного запуска игры с установленным модом.'
    },
    loading: 'Поиск файлов конфигурации',
    actions: {
        delete: 'Удалить',
        editConfig: 'Редактировать конфиг',
        openFile: 'Открыть файл',
        search: {
            label: 'Поиск',
            placeholder: 'Поиск файла конфигурации',
        },
        sort: {
            label: 'Сортировка'
        }
    },
    editConfig: {
        actions: {
            cancel: 'Отмена',
            save: 'Сохранить',
            showMore: 'Показать больше',
            showLess: 'Показать меньше'
        },
        sections: 'Разделы',
        hiddenCount: '(скрыт {count}) | (скрыто {count}) | (скрыто {count}) | (скрыто {count})',
        selectOption: 'Выберите вариант',
        subtitle: 'Редактирование файла конфигурации'
    }
};
