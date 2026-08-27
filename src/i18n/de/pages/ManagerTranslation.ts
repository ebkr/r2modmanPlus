import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: 'Mit Mods starten',
            startVanilla: 'Vanilla starten'
        },
        modsActions: {
            label: 'Mods',
            installed: 'Installiert',
            online: 'Online'
        },
        otherActions: {
            label: 'Sonstiges',
            configEditor: 'Konfigurationseditor',
            settings: 'Einstellungen',
            help: 'Hilfe',
        },
        profileSwitcher: {
            label: 'Profil',
            gameIconAltText: 'Spielbild',
            close: 'Schließen',
        },
        activityBar: {
            exportProfile: 'Profil exportieren',
            exportToCode: 'Als Code exportieren',
            exportToFile: 'Als Datei exportieren',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Es sieht so aus, als hättest du keine Mods installiert',
            content: 'Du kannst links auf den Tab "Online" klicken, um alle verfügbaren Mods zu durchsuchen.',
        },
        searchAndSort: {
            search: {
                label: 'Suchen',
                placeholder: 'Nach einer installierten Mod suchen',
            },
            sort: {
                label: 'Sortieren',
                disabledPositions: {
                    label: 'Deaktiviert',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Veraltet',
                disabled: 'Deaktiviert'
            },
            display: {
                byline: 'v{version} von {author}',
                installedAt: 'Installiert am: {formattedDate}',
                releasedAt: 'Veröffentlicht am: {formattedDate}',
            },
            concerning: {
                recommendation: 'Es wird empfohlen, diese Mod zu entfernen.',
            },
            tooltips: {
                updateAvailable: 'Ein Update ist verfügbar',
                dependencyIssue: 'Es gibt ein Problem mit den Abhängigkeiten dieser Mod',
                disable: 'Deaktivieren',
                enable: 'Aktivieren',
                donate: 'Dem Mod-Autor spenden',
                willNotBeUsed: 'Diese Mod wird im Spiel nicht verwendet',
            },
            actions: {
                uninstall: 'Deinstallieren',
                disable: 'Deaktivieren',
                enable: 'Aktivieren',
                associated: 'Zugehörig',
                openWebsite: 'Website',
                update: 'Aktualisieren',
                downloadDependency: 'Abhängigkeit herunterladen',
                enableSpecific: '{dependencyName} aktivieren',
                donate: 'Spenden',
            }
        },
        expandableCard: {
            imageAltText: 'Mod-Bild',
            funkyModeAltText: 'Funky-Modus-Overlay',
            tooltips: {
                dragToReorder: 'Zum Sortieren ziehen',
                expand: 'Erweitern',
                collapse: 'Einklappen',
            }
        },
    },
    online: {
        previewPanel: {
            author: 'Von {author}',
            metadata: {
                downloads: 'Downloads: {downloads}',
                likes: 'Likes: {likes}',
                lastUpdated: 'Zuletzt aktualisiert: {date}',
                categories: 'Kategorien: {categories}',
            },
            actions: {
                download: 'Herunterladen',
                viewOnline: 'Online ansehen',
                donate: 'Spenden',
            },
            tabs: {
                readme: 'README',
                changelog: 'Änderungen',
                dependencies: 'Abhängigkeiten ({dependencyCount})',
            },
            packageInformation: 'Paketinformationen',
            nsfwWarning: 'Diese Mod kann potenziell explizites Material enthalten',
            fetchingData: 'Daten werden abgerufen',
            noDependencies: 'Diese Mod hat keine Abhängigkeiten',
            unableToFetchReadme: 'README konnte nicht abgerufen werden',
            unableToFetchChangelog: 'CHANGELOG konnte nicht abgerufen werden',
        },
        topbar: {
            search: {
                label: 'Suchen',
                placeholder: 'Nach einer Mod suchen',
            },
            sort: 'Sortieren',
            filter: 'Filtern',
        },
        pagination: {
            changePageInfo: 'Verwende die Zahlen unten, um die Seite zu wechseln',
            noFoundMods: 'Keine Mods gefunden, die der Suche entsprechen',
            noMods: 'Keine Mods verfügbar',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Angeheftet',
                    long: 'Auf Thunderstore angeheftet'
                },
                deprecated: {
                    short: 'Veraltet',
                    long: 'Diese Mod funktioniert möglicherweise nicht mehr'
                },
                donate: 'Dem Mod-Autor spenden',
                installed: 'Mod bereits installiert',
                nsfw: 'Mod als NSFW gekennzeichnet',
            },
            mod: {
                author: 'Von {author}'
            },
            actions: {
                download: 'Herunterladen',
                website: 'Website',
            }
        }
    },
    actions: {
        locateGameExecutable: 'Executable von {gameName} suchen',
        selectExecutable: 'Executable auswählen',
        locateGameLaunchHelper: 'Executable von gamelaunchhelper suchen',
        locateSteamExecutable: 'Steam-Executable suchen',
    }
}
