// This is just an example,
// so you can safely delete all default props below

import { MessageFormat } from '../index';

const message: MessageFormat = {
    metadata: {
        name: 'English',
        locale: 'en'
    },
    translations: {
        pages: {
            gameSelection: {
                platformModal: {
                    header: "Which store manages your game?",
                    selectAction: "Select platform",
                },
                pageTitle: {
                    title: {
                        game: 'Game selection',
                        server: 'Server selection',
                    },
                    subtitle: {
                        game: 'Which game are you managing your mods for?',
                        server: 'Which dedicated server are you managing your mods for?',
                    }
                },
                migrationNotice: {
                    requiresUpdate: 'An update to the manager has occurred and needs to do background work.',
                    actionsDisabled: 'The options to select a game are disabled until the work has completed.',
                },
                tabs: {
                    game: 'Game',
                    server: 'Server'
                },
                actions: {
                    select: {
                        game: 'Select game',
                        server: 'Select server'
                    },
                    setAsDefault: 'Set as default'
                },
                filter: {
                    placeholder: {
                        game: 'Search for a game',
                        server: 'Search for a server',
                    }
                }
            }
        },
        platforms: {
            STEAM: "Steam",
            STEAM_DIRECT: "Steam",
            EPIC_GAMES_STORE: "Epic Games Store",
            OCULUS_STORE: "Oculus Store",
            ORIGIN: "Origin / EA App",
            XBOX_GAME_PASS: "Xbox Game Pass",
            OTHER: "Autre",
        }
    }
};

// Exported separately to enforce validation on exported type
export default message;
