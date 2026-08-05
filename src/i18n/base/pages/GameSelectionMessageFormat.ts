export type GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: string;
            server: string;
        }
        subtitle: {
            game: string;
            server: string;
        }
    },
    migrationNotice: {
        requiresUpdate: string;
        actionsDisabled: string;
    },
    filter: {
        placeholder: {
            game: string;
            server: string;
        };
    },
    noResults: {
        empty: {
            game: string;
            server: string;
        },
        title: string;
        suggestion: string;
    },
    actions: {
        select: {
            game: string;
            server: string;
        },
        setAsDefault: string;
        request: {
            game: string;
            server: string;
        };
    },
    tabs: {
        game: string;
        server: string;
    },
    cardView: {
        imageAltText: string;
        newBadge: string;
        sections: {
            favourites: string;
            games: string;
            servers: string;
            newlyAdded: {
                games: string;
                servers: string;
            },
            searchResults: string;
            hiddenGames: string;
            hiddenGamesNotice: string;
        }
    },
    ecosystemUpdate: {
        updating: string;
        upToDate: string;
        failed: string;
        retry: string;
    },
    loading: string;
}
