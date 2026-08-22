import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: 'Uruchom z modami',
            startVanilla: 'Uruchom bez modów'
        },
        modsActions: {
            label: 'Mody',
            installed: 'Zainstalowane',
            online: 'Online'
        },
        otherActions: {
            label: 'Inne',
            configEditor: 'Edytor konfiguracji',
            settings: 'Ustawienia',
            help: 'Pomoc',
        },
        profileSwitcher: {
            label: 'Profil',
            gameIconAltText: 'Obraz gry',
            close: 'Zamknij',
        },
        activityBar: {
            exportProfile: 'Eksportuj profil',
            exportToCode: 'Eksportuj do kodu',
            exportToFile: 'Eksportuj do pliku',
        }
    },
    installed: {
        noModsInstalled: {
            title: 'Wygląda na to, że nie masz zainstalowanych żadnych modów',
            content: 'Kliknij zakładkę Online po lewej, aby przejrzeć wszystkie dostępne mody.',
        },
        searchAndSort: {
            search: {
                label: 'Szukaj',
                placeholder: 'Wyszukaj zainstalowany mod',
            },
            sort: {
                label: 'Sortuj',
                disabledPositions: {
                    label: 'Wyłączone',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Przestarzały',
                disabled: 'Wyłączony'
            },
            display: {
                byline: 'v{version} autor {author}',
                installedAt: 'Zainstalowano: {formattedDate}',
                releasedAt: 'Wydano: {formattedDate}',
            },
            concerning: {
                recommendation: 'Zaleca się usunięcie tego moda.',
            },
            tooltips: {
                updateAvailable: 'Dostępna jest aktualizacja',
                dependencyIssue: 'Występuje problem z zależnościami tego moda',
                disable: 'Wyłącz',
                enable: 'Włącz',
                donate: 'Wesprzyj autora moda',
                willNotBeUsed: 'Ten mod nie będzie używany w grze',
            },
            actions: {
                uninstall: 'Odinstaluj',
                disable: 'Wyłącz',
                enable: 'Włącz',
                associated: 'Powiązane',
                openWebsite: 'Strona internetowa',
                update: 'Aktualizuj',
                downloadDependency: 'Pobierz zależności',
                enableSpecific: 'Włącz {dependencyName}',
                donate: 'Wesprzyj',
            }
        },
        expandableCard: {
            imageAltText: 'Obraz moda',
            funkyModeAltText: 'Nakładka trybu funky',
            tooltips: {
                dragToReorder: 'Przeciągnij, aby zmienić kolejność',
                expand: 'Rozwiń',
                collapse: 'Zwiń',
            }
        },
    },
    online: {
        previewPanel: {
            author: 'Autor: {author}',
            metadata: {
                downloads: 'Pobrania: {downloads}',
                likes: 'Polubienia: {likes}',
                lastUpdated: 'Ostatnia aktualizacja: {date}',
                categories: 'Kategorie: {categories}',
            },
            actions: {
                download: 'Pobierz',
                viewOnline: 'Wyświetl online',
                donate: 'Wesprzyj',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: 'Zależności ({dependencyCount})',
            },
            packageInformation: 'Informacje o pakiecie',
            nsfwWarning: 'Ten mod może zawierać potencjalnie nieodpowiednie treści',
            fetchingData: 'Pobieranie danych',
            noDependencies: 'Ten mod nie ma żadnych zależności',
            unableToFetchReadme: 'Nie można pobrać README',
            unableToFetchChangelog: 'Nie można pobrać CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Szukaj',
                placeholder: 'Wyszukaj mod',
            },
            sort: 'Sortuj',
            filter: 'Filtruj',
        },
        pagination: {
            changePageInfo: 'Użyj poniższych numerów, aby zmienić stronę',
            noFoundMods: 'Nie znaleziono modów pasujących do wyszukiwania',
            noMods: 'Brak dostępnych modów',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Przypięty',
                    long: 'Przypięty na Thunderstore'
                },
                deprecated: {
                    short: 'Przestarzały',
                    long: 'Ten mod może już nie działać'
                },
                donate: 'Wesprzyj autora moda',
                installed: 'Mod jest już zainstalowany',
                nsfw: 'Mod oznaczony jako NSFW',
            },
            mod: {
                author: 'Autor: {author}'
            },
            actions: {
                download: 'Pobierz',
                website: 'Strona internetowa',
            }
        }
    },
    actions: {
        locateGameExecutable: 'Zlokalizuj plik wykonywalny {gameName}',
        selectExecutable: 'Wybierz plik wykonywalny',
        locateGameLaunchHelper: 'Zlokalizuj plik wykonywalny gamelaunchhelper',
        locateSteamExecutable: 'Zlokalizuj plik wykonywalny Steam',
    }
}
