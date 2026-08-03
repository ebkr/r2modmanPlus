import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
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
    noResults: {
        empty: {
            game: 'No games found matching "{filterText}"',
            server: 'No servers found matching "{filterText}"',
        },
        title: 'Can\'t find what you\'re looking for?',
        suggestion: 'Try a different game title or keyword. We may not support this game yet.',
    },
    actions: {
        select: {
            game: 'Select game',
            server: 'Select server'
        },
        setAsDefault: 'Set as default',
        request: {
            game: 'Request a new game',
            server: 'Request a new server',
        }
    },
    filter: {
        placeholder: {
            game: 'Search for a game',
            server: 'Search for a server',
        }
    },
    cardView: {
        imageAltText: 'Game image',
        newBadge: 'New',
        sections: {
            favourites: 'Favourites',
            games: 'Games',
            servers: 'Servers',
            newlyAdded: {
                games: 'New games',
                servers: 'New servers',
            },
            searchResults: 'Search results',
            hiddenGames: 'Hidden games',
            hiddenGamesNotice: 'These games are no longer supported.',
        }
    },
    ecosystemUpdate: {
        updating: 'Updating game list',
        upToDate: 'You have the latest game list',
        failed: 'Failed to update game list',
        retry: 'Retry game list update',
    }
}
