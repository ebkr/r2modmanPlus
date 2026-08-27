import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Downloads',
        subtitle: 'Fortschritt der Downloads überwachen'
    },
    actions: {
        retry: 'Erneut versuchen',
        remove: 'Entfernen'
    },
    state: {
        hasNothing: {
            inform: `Du hast keine aktiven Downloads`,
            action: 'Klicke hier, um etwas herunterzuladen'
        },
        hasContent: {
            action: 'Abgeschlossene löschen',
            downloadFailed: 'Download fehlgeschlagen',
            downloadComplete: 'Download abgeschlossen'
        },
        modProgress: {
            downloading: 'Wird heruntergeladen: {modName}',
            extracting: 'Wird entpackt: {modName}',
            progress: '{progress}% von {totalSize}',
            installing: 'Wird installiert: {modName}',
            waiting: 'Warten auf den Abschluss des Downloads',
            installProgress: '{progress}% abgeschlossen',
        }
    }
}
