import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Descărcări',
        subtitle: 'Supraveghează progresul descărcărilor'
    },
    actions: {
        retry: 'Încearcă din nou',
        remove: 'Scoate'
    },
    state: {
        hasNothing: {
            inform: `Nu ai nimic în proces de descărcare`,
            action: 'Apasă aici ca să descarci ceva'
        },
        hasContent: {
            action: 'Curăță obiectele finisate',
            downloadFailed: 'Descărcare eșuată',
            downloadComplete: 'Descărcare completă'
        },
        modProgress: {
            downloading: 'Descărcare: {modName}',
            extracting: 'Extragere: {modName}',
            progress: '{progress}% din {totalSize}',
            installing: 'Instalare: {modName}',
            waiting: 'Așteptăm ca descărcarea să se termine',
            installProgress: '{progress}% complet',
        }
    }
}
