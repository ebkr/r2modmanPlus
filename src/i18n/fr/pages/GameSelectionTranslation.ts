import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    platformModal: {
        header: "Sélectionnez le magasin pour vos jeux",
        selectAction: "Sélectionnez le magasin"
    },
    pageTitle: {
        title: {
            game: 'Sélectionnez un jeu',
            server: 'Sélectionnez un serveur'
        },
        subtitle: {
            game: 'Sélectionnez un jeu pour gérer vos mods',
            server: 'Sélectionnez un serveur pour gérer vos mods'
        }
    },
    migrationNotice: {
        requiresUpdate: 'Une mise à jour du gestionnaire a eu lieu et un travail de fond est nécessaire.',
        actionsDisabled: 'Les actions de sélection de jeu sont désactivées jusqu\'à ce que le travail soit terminé.'
    },
    tabs: {
        game: 'Jeu',
        server: 'Serveur'
    },
    actions: {
        select: {
            game: 'Sélectionner',
            server: 'Sélectionner'
        },
        setAsDefault: 'Définir par défaut'
    },
    filter: {
        placeholder: {
            game: 'Rechercher un jeu',
            server: 'Rechercher un serveur'
        }
    }
}
