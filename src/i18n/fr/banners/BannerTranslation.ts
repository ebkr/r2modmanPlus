import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: 'Certains de vos mods sont introuvables sur Thunderstore.',
        action: 'Cliquez ici pour les vérifier.',
    },
    managerUpdate: {
        title: 'Une mise à jour de {appName} est disponible.',
        linkText: 'Cliquez ici pour accéder à la page de la version.',
    },
    modListUpdate: {
        error: 'Erreur lors de l\'actualisation de la liste des mods.',
        viewDetails: 'Voir les détails de l\'erreur',
        willKeepTrying: 'Le gestionnaire continuera d\'essayer d\'actualiser la liste des mods en arrière-plan.',
        errorOccurred: 'Une erreur est survenue lors de l\'actualisation de la liste des mods depuis Thunderstore.',
        blockedByDownloads: 'Cependant, la liste des mods ne peut pas être actualisée pendant que des téléchargements sont en cours.',
        waitForDownloads: 'Veuillez attendre la fin des téléchargements avant de continuer.',
        retryPrompt: 'Une erreur est survenue lors de l\'actualisation de la liste des mods depuis Thunderstore. Voulez-vous {retryAction} ?',
        retryAction: 'réessayer maintenant',
    },
    updatableMods: {
        text: `
        Vous avez {numberOfModsWithUpdates} mod avec une mise à jour disponible. |
        Vous avez {numberOfModsWithUpdates} mods avec des mises à jour disponibles.
        `,
        updateAction: 'Tout mettre à jour ?',
    }
}
