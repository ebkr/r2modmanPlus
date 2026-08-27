import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: 'Hilfe',
        subtitle: 'Häufige Probleme und mögliche Lösungen'
    },
    tabs: {
        general: 'Allgemein',
        gameWontStart: 'Spiel startet nicht',
        modsNotShowing: 'Mods werden nicht angezeigt',
        updating: 'Aktualisierung',
    },
    general: {
        gettingStarted: {
            title: 'Beginne mit der Installation von Mods',
            whereToFindMods: `
            Gehe zum Tab "{''}@:translations.pages.manager.navigation.modsActions.online{''}", suche nach einer Mod und klicke auf "Herunterladen".
            Die Abhängigkeiten werden ebenfalls heruntergeladen, sodass du Zeit sparst.
            `,
            onceInstalled: 'Sobald du die gewünschten Mods installiert hast, klicke einfach oben links auf {startModdedAction}.',
        },
        slowGame: {
            title: 'Spiel mit Mods langsam oder ruckelig?',
            likelyCause: `
            Dies wird wahrscheinlich durch eine Mod verursacht, die Fehler auslöst.
            Eine mögliche Lösung besteht darin, zunächst die Hälfte deiner Mods zu deaktivieren und zu prüfen, ob das Problem weiterhin besteht.
            `,
            issuePersisting: `
            Wenn das Problem weiterhin besteht, deaktiviere eine weitere Hälfte.
            Wiederhole dies, bis das Problem behoben ist.
            `,
            ifStutters: 'Bei Rucklern können möglicherweise Optimierungsmods helfen.',
        },
        dedicatedServers: {
            title: 'Dedizierte Server',
            content: `
            Dedizierte Server werden vom Manager nicht direkt unterstützt. Eine mögliche Lösung besteht jedoch darin,
            den Inhalt deines Profilordners in den Ordner deines dedizierten Servers zu kopieren.
            `,
        },
        launchingExternally: {
            title: 'Das Spiel außerhalb des Mod-Managers starten',
            howTo: 'Wenn du das Spiel über Steam startest, ist es standardmäßig Vanilla (ohne Mods).',
            whereToPlace: 'Du musst das entsprechende Argument im dafür vorgesehenen Bereich für Startparameter deiner Plattform eintragen.',
            forSteam: 'Bei Steam findest du diesen Bereich in den Eigenschaften des Spiels.',
            yourCurrentArgument: 'Dein aktuelles Argument lautet:',
            loaderNotInstalled: 'Diese Parameter sind verfügbar, sobald ein Mod Loader installiert wurde.',
            copyArguments: 'Startargumente kopieren',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'Beim Starten des Spiels erscheint ein rotes Fenster',
            solution: 'Normalerweise wird unten im roten Fenster ein Lösungsvorschlag angezeigt. Dieser kann das Problem beheben.',
        },
        redirectedToStorePage: {
            title: 'Ich werde zur Steam-Store-Seite weitergeleitet',
            solution: 'Du musst eine legale Kopie des Spiels besitzen, wenn du {appName} verwendest. Du kannst das Spiel auf der Store-Seite kaufen.',
        },
        consoleCloses: {
            title: 'Ein Textfenster erscheint und schließt sich sofort wieder',
            tryRunning: 'Versuche, auf der Einstellungsseite "{gameName}-Installation zurücksetzen" auszuführen.', // TODO - Reference translation via Settings screen
            ifPersists: 'Wenn das Problem weiterhin besteht, beende Steam vollständig und starte das Spiel mit Mods, während Steam geschlossen ist.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Mögliche Lösungen',
            instructToWiki: 'Die häufigsten Probleme lassen sich beheben, indem du die Anweisungen im Wiki genau befolgst.',
            goToWiki: 'Zum Wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Automatische Aktualisierungen',
            whenDoesItUpdate: 'Der Manager aktualisiert sich beim Schließen automatisch, sofern ein Update verfügbar ist.',
            downloadedInBackground: 'Updates werden im Hintergrund heruntergeladen.',
            promptToRunOldInstaller: 'Möglicherweise wirst du aufgefordert, "{oldInstaller}" als Administrator auszuführen. Dies ist der Updater.',
            ifProblemOccurs: 'Wenn beim Aktualisieren ein Problem auftritt, lade den neuesten Installer herunter und führe ihn aus.',
        },
        ignoreUpdates: {
            title: 'Ich möchte keine Updates',
            content: 'Auf GitHub gibt es eine portable Version, die nicht automatisch aktualisiert wird. Du wirst jedoch darüber informiert, dass ein Update verfügbar ist.'
        }
    }
}
