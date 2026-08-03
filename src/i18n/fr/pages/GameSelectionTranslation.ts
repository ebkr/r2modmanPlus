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
    noResults: {
        empty: {
            game: 'Aucun jeu ne correspond à "{filterText}"',
            server: 'Aucun serveur ne correspond à "{filterText}"',
        },
        title: 'Vous ne trouvez pas ce que vous cherchez ?',
        suggestion: 'Essayez un autre titre ou mot-clé. Il se peut que ce jeu ne soit pas encore pris en charge.',
    },
    actions: {
        select: {
            game: 'Sélectionner',
            server: 'Sélectionner'
        },
        setAsDefault: 'Définir par défaut',
        request: {
            game: 'Demander l\'ajout d\'un jeu',
            server: 'Demander l\'ajout d\'un serveur',
        }
    },
    filter: {
        placeholder: {
            game: 'Rechercher un jeu',
            server: 'Rechercher un serveur'
        }
    },
    cardView: {
        imageAltText: 'Image du jeu',
        newBadge: 'Nouveau',
        sections: {
            favourites: 'Favoris',
            games: 'Jeux',
            servers: 'Serveurs',
            newlyAdded: {
                games: 'Nouveaux jeux',
                servers: 'Nouveaux serveurs',
            },
            searchResults: 'Résultats de recherche',
            hiddenGames: 'Jeux masqués',
            hiddenGamesNotice: 'Ces jeux ne sont plus pris en charge.',
        }
    },
    ecosystemUpdate: {
        updating: 'Mise à jour de la liste des jeux',
        upToDate: 'Votre liste de jeux est à jour',
        failed: 'Échec de la mise à jour de la liste des jeux',
        retry: 'Réessayer la mise à jour de la liste des jeux',
    }
}
