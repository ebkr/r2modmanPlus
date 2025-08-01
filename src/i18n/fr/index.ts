// This is just an example,
// so you can safely delete all default props below

import { MessageFormat } from '../index';

const message: MessageFormat = {
    metadata: {
        name: 'French',
        locale: 'fr'
    },
    translations: {
        pages: {
            gameSelection: {
                platformModal: {
                    header: "Sélectionnez le magasin pour vos jeux",
                    selectAction: "Sélectionnez le magasin",
                },
                pageTitle: {
                    title: {
                        game: 'Sélectionnez un jeu',
                        server: 'Sélectionnez un serveur',
                    },
                    subtitle: {
                        game: 'Sélectionnez un jeu pour gérer vos mods',
                        server: 'Sélectionnez un serveur pour gérer vos mods',
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
                        server: 'Sélectionner',
                    },
                    setAsDefault: 'Définir par défaut'
                },
                filter: {
                    placeholder: {
                        game: 'Rechercher un jeu',
                        server: 'Rechercher un serveur'
                    }
                }
            },
            splash: {
                pageTitle: 'Démarrage de {appName}',
                states: {

                }
            }
        },
        platforms: {
            STEAM: "Steam",
            STEAM_DIRECT: "Steam",
            EPIC_GAMES_STORE: "Epic Games Store",
            OCULUS_STORE: "Oculus / Meta Magasin",
            ORIGIN: "Origin / EA App",
            XBOX_GAME_PASS: "Xbox Game Pass",
            OTHER: "Autre",
        }
    }
};

// Exported separately to enforce validation on exported type
export default message;
