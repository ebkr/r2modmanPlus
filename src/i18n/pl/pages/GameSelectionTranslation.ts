import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: 'Wybór gry',
            server: 'Wybór serwera',
        },
        subtitle: {
            game: 'Do której gry zarządzasz modami?',
            server: 'Dla którego serwera dedykowanego zarządzasz modami?',
        }
    },
    migrationNotice: {
        requiresUpdate: 'Wykonano aktualizację menedżera, która wymaga wykonania dodatkowych działań w tle.',
        actionsDisabled: 'Opcje wyboru gry są wyłączone do czasu zakończenia tych działań.',
    },
    tabs: {
        game: 'Gra',
        server: 'Serwer'
    },
    noResults: {
        empty: {
            game: 'Nie znaleziono gier pasujących do "{filterText}"',
            server: 'Nie znaleziono serwerów pasujących do "{filterText}"',
        },
        title: 'Nie możesz znaleźć tego, czego szukasz?',
        suggestion: 'Spróbuj innego tytułu gry lub słowa kluczowego. Możliwe, że ta gra nie jest jeszcze obsługiwana.',
    },
    actions: {
        select: {
            game: 'Wybierz grę',
            server: 'Wybierz serwer'
        },
        setAsDefault: 'Ustaw jako domyślne',
        request: {
            game: 'Poproś o dodanie nowej gry',
            server: 'Poproś o dodanie nowego serwera',
        }
    },
    filter: {
        placeholder: {
            game: 'Wyszukaj grę',
            server: 'Wyszukaj serwer',
        }
    },
    cardView: {
        imageAltText: 'Obraz gry',
        newBadge: 'Nowe',
        sections: {
            favourites: 'Ulubione',
            games: 'Gry',
            servers: 'Serwery',
            newlyAdded: {
                games: 'Nowe gry',
                servers: 'Nowe serwery',
            },
            searchResults: 'Wyniki wyszukiwania',
            hiddenGames: 'Ukryte gry',
            hiddenGamesNotice: 'Te gry nie są już obsługiwane.',
        }
    },
    ecosystemUpdate: {
        updating: 'Aktualizowanie listy gier',
        upToDate: 'Masz najnowszą listę gier',
        failed: 'Nie udało się zaktualizować listy gier',
        retry: 'Ponów aktualizację listy gier',
    },
    loading: 'Przygotowywanie gier',
}
