import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Pobieranie',
        subtitle: 'Monitoruj postęp pobierania'
    },
    actions: {
        retry: 'Spróbuj ponownie',
        remove: 'Usuń'
    },
    state: {
        hasNothing: {
            inform: 'Nie masz niczego do pobrania',
            action: 'Kliknij tutaj, aby coś pobrać'
        },
        hasContent: {
            action: 'Wyczyść ukończone',
            downloadFailed: 'Pobieranie nie powiodło się',
            downloadComplete: 'Pobieranie zakończone'
        },
        modProgress: {
            downloading: 'Pobieranie: {modName}',
            extracting: 'Rozpakowywanie: {modName}',
            progress: '{progress}% z {totalSize}',
            installing: 'Instalowanie: {modName}',
            waiting: 'Oczekiwanie na zakończenie pobierania',
            installProgress: 'Ukończono {progress}%',
        }
    }
}
