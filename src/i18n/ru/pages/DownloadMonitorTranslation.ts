import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Загрузки',
        subtitle: 'Следите за ходом загрузок'
    },
    actions: {
        retry: 'Повторить',
        remove: 'Убрать'
    },
    state: {
        hasNothing: {
            inform: `У вас нет активных загрузок`,
            action: 'Нажмите, чтобы что-нибудь скачать'
        },
        hasContent: {
            action: 'Очистить завершённые',
            downloadFailed: 'Загрузка не удалась',
            downloadComplete: 'Загрузка завершена'
        },
        modProgress: {
            downloading: 'Скачивание: {modName}',
            extracting: 'Распаковка: {modName}',
            progress: '{progress}% из {totalSize}',
            installing: 'Установка: {modName}',
            waiting: 'Ожидание завершения загрузки',
            installProgress: 'Выполнено на {progress}%',
        }
    }
}
