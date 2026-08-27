import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: 'Ustawienia',
        subtitle: 'Zaawansowane opcje dla {appName}: {version}',
    },
    nav: {
        label: 'Sekcje',
        categories: {
            all: 'Wszystkie',
            directories: 'Katalogi',
            profile: 'Profil',
            appearance: 'Wygląd',
            debugging: 'Debugowanie',
            modpacks: 'Paczki modów',
            other: 'Inne',
        }
    },
    search: {
        label: 'Szukaj',
        placeholder: 'Wyszukaj ustawienie',
    },
    actions: {
        change: 'Zmień',
        browse: 'Przeglądaj',
        notSet: 'Nie ustawiono',
    },
    entries: {
        changeLaunchBehaviour: {
            title: 'Zmień sposób uruchamiania',
            description: 'Wybierz konkretny sposób uruchamiania. Możesz określić, że gra korzysta z opcji Native lub Proton.',
            current: 'Obecny sposób uruchamiania:',
            searchTerms: [
                'Zmień sposób uruchamiania',
                'Ustaw tryb uruchamiania',
                'Proton',
                'Native',
                'Automatyczny',
            ],
        },
        cleanOnlineModListCache: {
            title: 'Wyczyść pamięć podręczną listy modów online',
            description: 'Usuwa lokalną kopię listy modów i pobiera nową.',
            action: 'Wyczyść listę modów online',
            searchTerms: [
                'Wyczyść pamięć podręczną listy modów online',
                'Resetuj',
            ],
        },
        copyLogToClipboard: {
            title: 'Kopiuj dziennik do schowka',
            description: 'Kopiuje zawartość pliku dziennika do schowka w formacie odpowiednim dla Discorda.',
            searchTerms: [
                'Kopiuj zawartość pliku dziennika do schowka',
                'LogOutput',
                'LogOutput.txt',
                'Discord',
            ],
        },
        copyTroubleshooting: {
            title: 'Kopiuj informacje diagnostyczne do schowka',
            description: 'Kopiuje ustawienia i inne informacje do schowka w formacie odpowiednim dla Discorda. Udostępnij je podczas zgłaszania problemu.',
            searchTerms: [
                'Kopiuj informacje diagnostyczne do schowka',
                'Discord',
                'Pomoc',
                'System',
            ],
        },
        dataDirectory: {
            title: 'Foldery danych i profili',
            description: 'Folder, w którym przechowywane są mody dla wszystkich gier i profili.',
            warning: 'Zmiana folderu danych nie przenosi ani nie usuwa istniejących profili. Pozostaną one jednak w starym folderze.',
            dataFolder: 'Folder danych',
            profileFolder: 'Folder profilu',
            dialog: {
                title: 'Wybierz nowy folder do przechowywania danych {appName}',
                button: 'Wybierz folder danych',
            },
            searchTerms: [
                'Katalogi danych i profili',
                'Zmień',
                'Przeglądaj',
                'Folder',
                'Katalog',
            ],
        },
        downloadCache: {
            title: 'Pamięć podręczna pobierania',
            description: 'Po włączeniu pobieranie zostanie pominięte, jeśli istnieje już zapisana kopia.',
            enabled: 'Włączone (zalecane)',
            disabled: 'Wyłączone',
            searchTerms: [
                'Przełącz pamięć podręczną pobierania',
                'Pamięć podręczna pobierania',
                'Przełącz',
            ],
        },
        expandCards: {
            title: 'Domyślnie rozwijaj karty',
            description: 'Wyświetlaj karty modów w pełni rozwinięte zamiast zwiniętych podczas otwierania listy modów.',
            expanded: 'Rozwinięte',
            collapsed: 'Zwinięte',
            searchTerms: [
                'Domyślnie rozwijaj karty',
                'Przełącz',
                'Zwinięte',
                'Rozwinięte',
            ],
        },
        exportProfile: {
            title: 'Eksportuj profil',
            description: 'Eksportuj listę modów i konfiguracje, aby łatwo udostępnić je znajomym i szybko utworzyć identyczny profil.',
            asFile: 'Jako plik',
            asCode: 'Jako kod',
            dialog: {
                title: 'Wybierz folder, do którego chcesz wyeksportować profil',
                button: 'Wybierz folder eksportu',
            },
            searchTerms: [
                'Eksportuj profil',
                'Jako plik',
                'Jako kod',
            ],
        },
        funkyMode: {
            title: 'Włącz tryb funky',
            description: 'To jest tryb funky.',
            enabled: 'Włączony',
            disabled: 'Wyłączony',
            searchTerms: [
                'Włącz tryb funky',
                'Przełącz',
                'Wyłącz'
            ],
        },
        gameDirectory: {
            title: 'Folder {gameName}',
            description: 'Katalog gry jest wymagany do prawidłowego umieszczenia odpowiednich plików.',
            warning: '{gameName} uruchomi się bez modów, jeśli nie zostanie ustawiony prawidłowo.',
            unsure: 'Nie wiem, co tutaj wpisać',
            searchTerms: [
                'Folder {gameName}',
                'Zmień',
                'Przeglądaj',
                'Gra',
                'Katalog',
                'Katalogi',
            ],
        },
        importLocalMod: {
            title: 'Importuj lokalny mod',
            description: 'Zainstaluj mod offline z plików na komputerze. Nie wszystkie mody można instalować lokalnie.',
            searchTerms: [
                'Importuj lokalny mod',
                'Zainstaluj offline',
                'Importuj',
            ],
        },
        launchArguments: {
            title: 'Argumenty uruchamiania',
            description: 'Podaj niestandardowe argumenty dodawane podczas uruchamiania gry.',
            action: 'Ustaw argumenty uruchamiania',
            searchTerms: [
                'Ustaw niestandardowe argumenty uruchamiania',
                'Parametry uruchamiania',
            ],
        },
        modCache: {
            title: 'Pamięć podręczna modów',
            description: 'Pobrane mody są przechowywane w pamięci podręcznej, aby nie trzeba było pobierać ich ponownie.',
            stillWritten: 'Mody nadal będą zapisywane w pamięci podręcznej i będą zajmować miejsce na dysku.',
            action: 'Wyczyść pamięć podręczną',
            actionDescription: 'Usuwa z pamięci podręcznej mody, które nie znajdują się w żadnym profilu, aby zwolnić miejsce.',
            enabled: 'Włączona',
            disabled: 'Wyłączona',
            enabledHint: 'Ponowne używanie pobranych plików z pamięci podręcznej (zalecane)',
            disabledHint: 'Ignoruje pamięć podręczną podczas pobierania modów. Pobiera je ponownie za każdym razem.',
            searchTerms: [
                'Pamięć podręczna modów',
                'Pobieranie',
                'Ponownie używaj pobranych plików',
                'Przełącz',
                'Wyczyść pamięć podręczną modów',
                'Zwolnij miejsce',
                'Wyczyść',
                'Pamięć',
            ],
        },
        modState: {
            title: 'Zmień stan modów',
            description: 'Włącz / wyłącz wszystkie mody w swoim profilu.',
            enableAll: 'Włącz wszystkie mody',
            disableAll: 'Wyłącz wszystkie mody',
            allEnabled: 'Wszystkie Twoje mody są obecnie włączone.',
            allDisabled: 'Wszystkie Twoje mody są obecnie wyłączone.',
            someDisabled: 'Masz wyłączony 1 mod. | Masz wyłączone {count} modów.',
            searchTerms: [
                'Zmień stan modów',
                'Przełącz',
                'Włącz wszystkie mody',
                'Wyłącz wszystkie mody',
            ],
        },
        onlineModList: {
            title: 'Lista modów online',
            description: 'Sprawdź nowe wydania modów lub usuń lokalną kopię.',
            refresh: 'Odśwież',
            deleteCopy: 'Usuń kopię',
            states: {
                refreshing: 'Odświeżanie...',
                error: 'Błąd podczas odświeżania listy modów: {message}',
                disabledWhileDownloading: 'Odświeżanie listy modów jest wyłączone, gdy trwają aktywne pobierania.',
                lastUpdated: 'Ostatnia aktualizacja: {date}',
                noApiInfo: 'Brak dostępnych informacji o API',
            },
            searchTerms: [
                'Odśwież listę modów online',
                'Sprawdź nowe wydania modów',
                'Wyczyść pamięć podręczną listy modów online',
                'Resetuj pamięć podręczną listy modów',
            ],
        },
        refreshOnlineModList: {
            title: 'Odśwież listę modów online',
            description: 'Sprawdź dostępność nowych wydań modów. {status}',
            action: 'Odśwież',
            states: {
                refreshing: 'Odświeżanie...',
                error: 'Błąd podczas odświeżania listy modów: {message}',
                disabledWhileDownloading: 'Odświeżanie listy modów jest wyłączone, gdy trwają aktywne pobierania.',
                cacheDate: 'Data pamięci podręcznej: {date}',
                noApiInfo: 'Brak dostępnych informacji o API',
            },
            searchTerms: [
                'Odśwież listę modów online',
                'Sprawdź nowe wydania modów',
                'Mody Thunderstore',
            ],
        },
        resetGameInstallation: {
            title: 'Zresetuj instalację {gameName}',
            description: 'Napraw problemy spowodowane uszkodzonymi plikami lub plikami pozostałymi po ręcznych próbach instalowania modów. Spowoduje to usunięcie całej zawartości folderu {folderName} i zweryfikuje pliki za pomocą Steam.',
            action: 'Zresetuj instalację',
            searchTerms: [
                'Zresetuj instalację {gameName}',
                'Sprawdź pliki',
                'Zweryfikuj integralność',
                'Uszkodzone',
                'Plik',
            ],
        },
        showDependencyStrings: {
            title: 'Pokaż ciągi zależności',
            description: 'Wyświetl listę zainstalowanych modów wraz z ich ciągami wersji używanymi w tablicy dependencies pliku manifest.json. Pokazuje ciągi zależności dla {modCount} mod(ów).',
            searchTerms: [
                'Pokaż ciągi zależności',
            ],
        },
        steamDirectory: {
            title: 'Folder Steam',
            description: 'Folder Steam zawierający plik wykonywalny Steam.',
            value: 'W ten sposób {appName} będzie uruchamiać grę.',
            searchTerms: [
                'Zmień folder Steam',
                'Zmień katalog Steam',
                'Przeglądaj',
                'Katalogi',
            ],
        },
        theme: {
            title: 'Motyw',
            description: 'Wybierz jasny lub ciemny wygląd menedżera.',
            light: 'Jasny',
            dark: 'Ciemny',
            searchTerms: [
                'Motyw',
                'Jasny',
                'Ciemny',
                'Wygląd',
            ],
        },
        toggleCdn: {
            title: 'Przełącz preferowany CDN (serwer plików) Thunderstore',
            description: 'Przełącz CDN. Aktywne do ponownego uruchomienia aplikacji. Może to pomóc tymczasowo ominąć problemy z pobieraniem modów.',
            action: 'Przełącz preferowany CDN',
            current: 'Obecnie: {label}',
            searchTerms: [
                'Przełącz preferowany CDN Thunderstore',
                'Zmień',
            ],
        },
        updateAllMods: {
            title: 'Aktualizuj wszystkie mody',
            description: 'Szybko zaktualizuj wszystkie zainstalowane mody do ich najnowszych wersji. {status}',
            status: '1 mod ma dostępną aktualizację. | {count} modów ma dostępne aktualizacje.',
            searchTerms: [
                'Aktualizuj wszystkie mody',
            ],
        },
    }
};
