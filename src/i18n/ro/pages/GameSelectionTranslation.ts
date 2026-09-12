import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: 'Selecție de jocuri',
            server: 'Selecție de servere',
        },
        subtitle: {
            game: 'Pentru care joc vrei să gestionezi mod-uri?',
            server: 'Pentru care server dedicat vrei să gestionezi mod-uri?',
        }
    },
    migrationNotice: {
        requiresUpdate: 'A apărut o actualizare a managerului și este necesară efectuarea unor operații de fundal.',
        actionsDisabled: 'Opțiunile de selectare a jocului sunt inactive până la terminarea operațiunilor.',
    },
    tabs: {
        game: 'Joc',
        server: 'Server'
    },
    noResults: {
        empty: {
            game: 'Nu am găsit jocuri care să se potrivească cu "{filterText}"',
            server: 'Nu am găsit servere care să se potrivească cu "{filterText}"',
        },
        title: 'Nu poți găsi ceea ce cauți?',
        suggestion: 'Încearcă un alt titlu de joc sau cuvânt cheie. E posibil ca acest joc să nu fie disponibil la moment.',
    },
    actions: {
        select: {
            game: 'Selectează joc',
            server: 'Selectează server'
        },
        setAsDefault: 'Setează ca implicit',
        request: {
            game: 'Cere un joc nou',
            server: 'Cere un server nou',
        }
    },
    filter: {
        placeholder: {
            game: 'Caută un joc',
            server: 'Caută un server',
        }
    },
    cardView: {
        imageAltText: 'Imagine joc',
        newBadge: 'Nou',
        sections: {
            favourites: 'Favorite',
            games: 'Jocuri',
            servers: 'Servere',
            newlyAdded: {
                games: 'Jocuri noi',
                servers: 'Servere noi',
            },
            searchResults: 'Rezultate căutare',
            hiddenGames: 'Jocuri ascunse',
            hiddenGamesNotice: 'Aceste jocuri nu mai sunt disponibile.',
        }
    },
    ecosystemUpdate: {
        updating: 'Actualizăm lista de jocuri',
        upToDate: 'Ai cea mai actuală listă de jocuri',
        failed: 'Nu am reușit să actualizăm lista de jocuri',
        retry: 'Reîncearcă actualizarea listei de jocuri',
    },
    loading: 'Pregătim jocurile',
}
