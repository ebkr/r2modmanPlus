import {GameSelectionMessageFormat} from "../../base/pages/GameSelectionMessageFormat";

export const GameSelectionTranslation: GameSelectionMessageFormat = {
    pageTitle: {
        title: {
            game: 'Spieleauswahl',
            server: 'Serverauswahl',
        },
        subtitle: {
            game: 'Für welches Spiel möchtest du deine Mods verwalten?',
            server: 'Für welchen dedizierten Server möchtest du deine Mods verwalten?',
        }
    },
    migrationNotice: {
        requiresUpdate: 'Ein Update des Managers wurde durchgeführt und muss Hintergrundaufgaben ausführen.',
        actionsDisabled: 'Die Optionen zur Auswahl eines Spiels sind deaktiviert, bis die Aufgaben abgeschlossen sind.',
    },
    tabs: {
        game: 'Spiel',
        server: 'Server'
    },
    noResults: {
        empty: {
            game: 'Keine Spiele gefunden, die zu "{filterText}" passen',
            server: 'Keine Server gefunden, die zu "{filterText}" passen',
        },
        title: 'Du findest nicht, wonach du suchst?',
        suggestion: 'Versuche es mit einem anderen Spieltitel oder Suchbegriff. Dieses Spiel wird möglicherweise noch nicht unterstützt.',
    },
    actions: {
        select: {
            game: 'Spiel auswählen',
            server: 'Server auswählen'
        },
        setAsDefault: 'Als Standard festlegen',
        request: {
            game: 'Neues Spiel anfordern',
            server: 'Neuen Server anfordern',
        }
    },
    filter: {
        placeholder: {
            game: 'Nach einem Spiel suchen',
            server: 'Nach einem Server suchen',
        }
    },
    cardView: {
        imageAltText: 'Spielbild',
        newBadge: 'Neu',
        sections: {
            favourites: 'Favoriten',
            games: 'Spiele',
            servers: 'Server',
            newlyAdded: {
                games: 'Neue Spiele',
                servers: 'Neue Server',
            },
            searchResults: 'Suchergebnisse',
            hiddenGames: 'Ausgeblendete Spiele',
            hiddenGamesNotice: 'Diese Spiele werden nicht mehr unterstützt.',
        }
    },
    ecosystemUpdate: {
        updating: 'Spieleliste wird aktualisiert',
        upToDate: 'Du hast die aktuellste Spieleliste',
        failed: 'Spieleliste konnte nicht aktualisiert werden',
        retry: 'Aktualisierung der Spieleliste erneut versuchen',
    },
    loading: 'Spiele werden vorbereitet',
}
