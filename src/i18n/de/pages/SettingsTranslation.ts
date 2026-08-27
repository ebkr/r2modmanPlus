import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: 'Einstellungen',
        subtitle: 'Erweiterte Optionen für {appName}: {version}',
    },
    nav: {
        label: 'Abschnitte',
        categories: {
            all: 'Alle',
            directories: 'Verzeichnisse',
            profile: 'Profil',
            appearance: 'Darstellung',
            debugging: 'Fehlerbehebung',
            modpacks: 'Modpacks',
            other: 'Sonstiges',
        }
    },
    search: {
        label: 'Suchen',
        placeholder: 'Nach einer Einstellung suchen',
    },
    actions: {
        change: 'Ändern',
        browse: 'Durchsuchen',
        notSet: 'Nicht festgelegt',
    },
    entries: {
        changeLaunchBehaviour: {
            title: 'Startverhalten ändern',
            description: 'Wähle ein bestimmtes Startverhalten aus. Du kannst dem Manager mitteilen, dass ein Spiel ausdrücklich entweder Native oder Proton verwendet.',
            current: 'Das aktuelle Startverhalten ist festgelegt auf:',
            searchTerms: [
                'Startverhalten ändern',
                'Startmodus festlegen',
                'Proton',
                'Native',
                'Automatisch',
            ],
        },
        cleanOnlineModListCache: {
            title: 'Cache der Online-Mod-Liste leeren',
            description: 'Löscht die lokale Kopie der Mod-Liste und lädt eine neue herunter.',
            action: 'Online-Mod-Liste bereinigen',
            searchTerms: [
                'Cache der Online-Mod-Liste leeren',
                'Zurücksetzen',
            ],
        },
        copyLogToClipboard: {
            title: 'Log in die Zwischenablage kopieren',
            description: 'Kopiert den Inhalt der Logdatei im für Discord formatierten Format in die Zwischenablage.',
            searchTerms: [
                'Inhalt der Logdatei in die Zwischenablage kopieren',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: 'Informationen zur Fehlerbehebung in die Zwischenablage kopieren',
            description: 'Kopiert Einstellungen und andere Informationen im für Discord formatierten Format in die Zwischenablage. Teile diese Informationen, wenn du Support anforderst.',
            searchTerms: [
                'Informationen zur Fehlerbehebung in die Zwischenablage kopieren',
                'Discord',
                'Support',
                'System',
            ],
        },
        dataDirectory: {
            title: 'Daten- und Profilordner',
            description: 'Der Ordner, in dem Mods für alle Spiele und Profile gespeichert werden.',
            warning: 'Das Ändern des Datenordners verschiebt oder löscht keine vorhandenen Profile. Sie verbleiben jedoch im alten Ordner.',
            dataFolder: 'Datenordner',
            profileFolder: 'Profilordner',
            dialog: {
                title: 'Neuen Ordner zum Speichern der {appName}-Daten auswählen',
                button: 'Datenordner auswählen',
            },
            searchTerms: [
                'Daten- und Profilverzeichnisse',
                'Ändern',
                'Durchsuchen',
                'Ordner',
                'Verzeichnis',
            ],
        },
        downloadCache: {
            title: 'Download-Cache',
            description: 'Wenn aktiviert, werden Downloads übersprungen, wenn bereits eine Kopie im Cache vorhanden ist.',
            enabled: 'Aktiviert (empfohlen)',
            disabled: 'Deaktiviert',
            searchTerms: [
                'Download-Cache umschalten',
                'Download-Cache',
                'Umschalten',
            ],
        },
        expandCards: {
            title: 'Karten standardmäßig erweitern',
            description: 'Zeigt Mod-Karten beim Öffnen einer Mod-Liste vollständig erweitert statt eingeklappt an.',
            expanded: 'Erweitert',
            collapsed: 'Eingeklappt',
            searchTerms: [
                'Karten standardmäßig erweitern',
                'Umschalten',
                'Eingeklappt',
                'Erweitert',
            ],
        },
        exportProfile: {
            title: 'Profil exportieren',
            description: 'Exportiere deine Mod-Liste und Konfigurationen, um sie mit Freunden zu teilen und schnell und einfach ein identisches Profil zu erstellen.',
            asFile: 'Als Datei',
            asCode: 'Als Code',
            dialog: {
                title: 'Ordner auswählen, in den dein Profil exportiert werden soll',
                button: 'Exportordner auswählen',
            },
            searchTerms: [
                'Profil exportieren',
                'Als Datei',
                'Als Code',
            ],
        },
        funkyMode: {
            title: 'Funky-Modus aktivieren',
            description: 'Es ist der Funky-Modus.',
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
            searchTerms: [
                'Funky-Modus aktivieren',
                'Umschalten',
                'Deaktivieren'
            ],
        },
        gameDirectory: {
            title: '{gameName}-Ordner',
            description: 'Das Spielverzeichnis wird benötigt, um die entsprechenden Dateien korrekt zu platzieren.',
            warning: '{gameName} wird ohne Mods gestartet, wenn dies nicht korrekt festgelegt ist.',
            unsure: 'Ich bin mir nicht sicher, was hier eingetragen werden sollte',
            searchTerms: [
                '{gameName}-Ordner',
                'Ändern',
                'Durchsuchen',
                'Spiel',
                'Verzeichnis',
                'Verzeichnisse',
            ],
        },
        importLocalMod: {
            title: 'Lokale Mod importieren',
            description: 'Installiere eine Mod offline aus deinen Dateien. Nicht alle Mods können lokal installiert werden.',
            searchTerms: [
                'Lokale Mod importieren',
                'Offline installieren',
                'Importieren',
            ],
        },
        launchArguments: {
            title: 'Startargumente',
            description: 'Gib benutzerdefinierte Argumente an, die beim Starten des Spiels hinzugefügt werden.',
            action: 'Startargumente festlegen',
            searchTerms: [
                'Benutzerdefinierte Startargumente festlegen',
                'Startparameter',
            ],
        },
        modCache: {
            title: 'Mod-Cache',
            description: 'Heruntergeladene Mods werden im Cache gespeichert, damit sie nicht erneut heruntergeladen werden müssen.',
            stillWritten: 'Mods werden weiterhin im Cache gespeichert und belegen weiterhin Speicherplatz.',
            action: 'Cache leeren',
            actionDescription: 'Entfernt gecachte Mods, die sich in keinem Profil befinden, um Speicherplatz freizugeben.',
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
            enabledHint: 'Gecachte Downloads wiederverwenden (empfohlen)',
            disabledHint: 'Cache beim Herunterladen von Mods ignorieren. Mods werden jedes Mal erneut heruntergeladen.',
            searchTerms: [
                'Mod-Cache',
                'Downloads',
                'Gecachte Downloads wiederverwenden',
                'Umschalten',
                'Mod-Cache leeren',
                'Speicherplatz freigeben',
                'Leeren',
                'Speicher',
            ],
        },
        modState: {
            title: 'Mod-Status ändern',
            description: 'Aktiviere / deaktiviere alle Mods in deinem Profil.',
            enableAll: 'Alle Mods aktivieren',
            disableAll: 'Alle Mods deaktivieren',
            allEnabled: 'Alle deine Mods sind derzeit aktiviert.',
            allDisabled: 'Alle deine Mods sind derzeit deaktiviert.',
            someDisabled: 'Du hast 1 deaktivierte Mod. | Du hast {count} deaktivierte Mods.',
            searchTerms: [
                'Mod-Status ändern',
                'Umschalten',
                'Alle Mods aktivieren',
                'Alle Mods deaktivieren',
            ],
        },
        onlineModList: {
            title: 'Online-Mod-Liste',
            description: 'Suche nach neuen Mod-Veröffentlichungen oder lösche die lokale Kopie.',
            refresh: 'Aktualisieren',
            deleteCopy: 'Kopie löschen',
            states: {
                refreshing: 'Wird aktualisiert...',
                error: 'Fehler beim Aktualisieren der Mod-Liste: {message}',
                disabledWhileDownloading: 'Das Aktualisieren der Mod-Liste ist während aktiver Downloads deaktiviert.',
                lastUpdated: 'Zuletzt aktualisiert am: {date}',
                noApiInfo: 'Keine API-Informationen verfügbar',
            },
            searchTerms: [
                'Online-Mod-Liste aktualisieren',
                'Nach neuen Mod-Veröffentlichungen suchen',
                'Cache der Online-Mod-Liste leeren',
                'Cache der Mod-Liste zurücksetzen',
            ],
        },
        refreshOnlineModList: {
            title: 'Online-Mod-Liste aktualisieren',
            description: 'Suche nach neuen Mod-Veröffentlichungen. {status}',
            action: 'Aktualisieren',
            states: {
                refreshing: 'Wird aktualisiert...',
                error: 'Fehler beim Aktualisieren der Mod-Liste: {message}',
                disabledWhileDownloading: 'Das Aktualisieren der Mod-Liste ist während aktiver Downloads deaktiviert.',
                cacheDate: 'Cache-Datum: {date}',
                noApiInfo: 'Keine API-Informationen verfügbar',
            },
            searchTerms: [
                'Online-Mod-Liste aktualisieren',
                'Nach neuen Mod-Veröffentlichungen suchen',
                'Thunderstore-Mods',
            ],
        },
        resetGameInstallation: {
            title: '{gameName}-Installation zurücksetzen',
            description: 'Behebt Probleme, die durch beschädigte Dateien oder Dateien aus manuellen Modding-Versuchen verursacht wurden. Dabei werden alle Inhalte des Ordners {folderName} gelöscht und die Dateien über Steam überprüft.',
            action: 'Installation zurücksetzen',
            searchTerms: [
                '{gameName}-Installation zurücksetzen',
                'Dateien validieren',
                'Integrität überprüfen',
                'Beschädigt',
                'Datei',
            ],
        },
        showDependencyStrings: {
            title: 'Abhängigkeiten anzeigen',
            description: 'Zeigt eine Liste der installierten Mods mit ihren Versionsangaben, wie sie im dependencies-Array einer manifest.json-Datei verwendet werden. Zeigt Abhängigkeiten für {modCount} Mod(s) an.',
            searchTerms: [
                'Abhängigkeiten anzeigen',
            ],
        },
        steamDirectory: {
            title: 'Steam-Ordner',
            description: 'Der Steam-Ordner, der die Steam-Executable enthält.',
            value: 'So wird {appName} das Spiel starten.',
            searchTerms: [
                'Steam-Ordner ändern',
                'Steam-Verzeichnis ändern',
                'Durchsuchen',
                'Verzeichnisse',
            ],
        },
        theme: {
            title: 'Design',
            description: 'Wähle zwischen einer hellen oder dunklen Darstellung des Managers.',
            light: 'Hell',
            dark: 'Dunkel',
            searchTerms: [
                'Design',
                'Hell',
                'Dunkel',
                'Darstellung',
            ],
        },
        toggleCdn: {
            title: 'Bevorzugtes Thunderstore-CDN wechseln',
            description: 'Wechsle das CDN, bis die App neu gestartet wird. Dies kann Probleme beim Herunterladen von Mods umgehen.',
            action: 'Bevorzugtes CDN wechseln',
            current: 'Aktuell: {label}',
            searchTerms: [
                'Bevorzugtes Thunderstore-CDN wechseln',
                'Ändern',
            ],
        },
        updateAllMods: {
            title: 'Alle Mods aktualisieren',
            description: 'Aktualisiere schnell alle installierten Mods auf ihre neuesten Versionen. {status}',
            status: 'Für 1 Mod ist ein Update verfügbar. | Für {count} Mods sind Updates verfügbar.',
            searchTerms: [
                'Alle Mods aktualisieren',
            ],
        },
    }
};
