import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Téléchargements',
        subtitle: 'Suivre la progression des téléchargements'
    },
    state: {
        hasNothing: {
            inform: `Aucun téléchargement en cours`,
            action: 'Cliquez ici pour télécharger quelque chose'
        },
        hasContent: {
            action: 'Effacer les terminés',
            downloadFailed: 'Échec du téléchargement',
            downloadComplete: 'Téléchargement terminé'
        },
        modProgress: {
            downloading: 'Téléchargement : {modName}',
            extracting: 'Extraction : {modName}',
            progress: '{progress} % de {totalSize}',
            installing: 'Installation : {modName}',
            waiting: 'En attente de la fin du téléchargement',
        }
    }
}
