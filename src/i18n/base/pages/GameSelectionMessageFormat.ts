export type GameSelectionMessageFormat = {
    platformModal: {
        header: string;
        selectAction: string;
    },
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
    actions: {
        select: {
            game: string;
            server: string;
        },
        setAsDefault: string;
    },
    tabs: {
        game: string;
        server: string;
    },
    cardView: {
        imageAltText: string;
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
    }
}
