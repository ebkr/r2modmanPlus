import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: 'Pomoc',
        subtitle: 'Typowe problemy i ich potencjalne rozwiązania'
    },
    tabs: {
        general: 'Ogólne',
        gameWontStart: 'Gra się nie uruchamia',
        modsNotShowing: 'Mody się nie wyświetlają',
        updating: 'Aktualizowanie',
    },
    general: {
        gettingStarted: {
            title: 'Zacznij od zainstalowania modów',
            whereToFindMods: `
            Przejdź do zakładki "{''}@:translations.pages.manager.navigation.modsActions.online{''}", znajdź mod i kliknij pobieranie.
            Zostaną również pobrane zależności, co pozwoli Ci zaoszczędzić czas.
            `,
            onceInstalled: 'Po zainstalowaniu modów, których chcesz używać, kliknij {startModdedAction} w lewym górnym rogu.',
        },
        slowGame: {
            title: 'Gra z modami działa wolno / zacina się?',
            likelyCause: `
            Prawdopodobnie jest to spowodowane modem generującym błędy.
            Jednym z rozwiązań jest wyłączenie połowy modów i sprawdzenie, czy problem nadal występuje.
            `,
            issuePersisting: `
            Jeśli problem nadal występuje, wyłącz kolejną połowę.
            Kontynuuj, aż problem zostanie rozwiązany.
            `,
            ifStutters: 'W przypadku zacinania się gry mogą istnieć mody optymalizacyjne, rozwiązujące problem.',
        },
        dedicatedServers: {
            title: 'Serwery dedykowane',
            content: `
            Serwery dedykowane nie są bezpośrednio obsługiwane przez menedżera, jednak rozwiązaniem jest
            skopiowanie zawartości folderu profilu do folderu serwera dedykowanego.
            `,
        },
        launchingExternally: {
            title: 'Uruchamianie gry spoza menedżera modów',
            howTo: 'Z założenia uruchamianie gry przez Steam zapewnia rozgrywkę w wersji vanilla (bez modów).',
            whereToPlace: 'Musisz dodać odpowiedni argument do parametrów uruchamiania na swojej platformie.',
            forSteam: 'W przypadku Steam znajduje się ono we właściwościach gry.',
            yourCurrentArgument: 'Twój obecny argument to:',
            loaderNotInstalled: 'Te parametry będą dostępne po zainstalowaniu mod loadera.',
            copyArguments: 'Kopiuj argumenty uruchamiania',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'Podczas próby uruchomienia gry pojawia się czerwone pole',
            solution: 'Zwykle na tle czerwonego pola znajduje się sugestia. Może ona rozwiązać problem.',
        },
        redirectedToStorePage: {
            title: 'Zostaję przekierowany na stronę sklepu Steam',
            solution: 'Musisz posiadać legalną kopię gry, aby korzystać z {appName}. Możesz ją kupić na stronie sklepu.',
        },
        consoleCloses: {
            title: 'Pojawia się okno tekstowe, które natychmiast się zamyka',
            tryRunning: 'Spróbuj uruchomić "Zresetuj instalację {gameName}" na ekranie Ustawień.', // TODO - Reference translation via Settings screen
            ifPersists: 'Jeśli problem nadal występuje, wymuś zamknięcie Steam i uruchom grę z modami przy zamkniętym Steam.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Potencjalne rozwiązania',
            instructToWiki: 'Najczęstsze problemy można rozwiązać, postępując dokładnie zgodnie z instrukcjami podanymi na wiki.',
            goToWiki: 'Przejdź do wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Automatyczne aktualizacje',
            whenDoesItUpdate: 'Menedżer aktualizuje się automatycznie przy zamykaniu, jeśli dostępna jest nowa wersja.',
            downloadedInBackground: 'Aktualizacje są pobierane w tle.',
            promptToRunOldInstaller: 'Może pojawić się prośba o uruchomienie "{oldInstaller}" jako administrator. Jest to aktualizator.',
            ifProblemOccurs: 'Jeśli wystąpi problem z aktualizacją, pobierz i uruchom najnowszy instalator.',
        },
        ignoreUpdates: {
            title: 'Nie chcę aktualizacji',
            content: 'Na GitHubie dostępna jest wersja przenośna, która nie aktualizuje się automatycznie. Otrzymasz jednak powiadomienie o dostępnej aktualizacji.'
        }
    }
}
