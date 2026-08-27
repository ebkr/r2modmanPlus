import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: 'Uruchamianie {appName}',
    gameUpdatesWarning: 'Aktualizacje gier mogą powodować problemy z modami. Jeśli została wydana nowa aktualizacja, proszę o cierpliwość.',
    menu: {
        helpLabel: 'Pomoc',
        helpItems: {
            about: 'O aplikacji',
            faq: 'FAQ'
        },
    },
    actions: {
        goBack: 'Wróć',
    },
    content: {
        main: {
            didYouKnow: 'Czy wiesz, że?',
            externalInstallWithModManager: `
                            Możesz użyć przycisku "Install with Mod Manager" na
                            Thunderstore, aby instalować mody za pomocą {appName}.
                        `,
            goToThunderstore: 'Przejdź do Thunderstore',
            exportProfile: `
                        Możesz wyeksportować wybrany profil z ekranu ustawień jako plik lub kod.
                        Ułatwia to udostępnianie listy modów znajomym!
                        `,
            havingTrouble: {
                title: 'Masz problemy?',
                body: 'Wyślij zrzut ekranu błędu na kanale pomocy serwera Discord {appName}.',
                serverLinkText: 'Dołącz do serwera Discord {appName}',
            },
        },
        about: {
            title: 'O aplikacji {appName}',
            creator: 'Została stworzona przez Ebkr.',
            techStack: {
                builtUsing: 'Aplikacja została zbudowana przy użyciu Quasar, który zapewnia następujący stos technologiczny:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: 'FAQ',
            howToGetStarted: {
                title: 'Jak zacząć?',
                body: 'Przejdź do zakładki Online i pobierz swoje ulubione mody. Kliknij "Uruchom z modami" i ciesz się grą.'
            },
            startingWithMods: {
                title: 'Uruchamianie gry z modami',
                body: `
                            Musisz uruchomić grę z poziomu menedżera.
                            Uruchomienie jej przez Steam nie zadziała bez ręcznych zmian.
                            `
            }
        }
    },
    states: {
        preparing: 'Przygotowywanie',
        checkingForUpdates: 'Sprawdzanie aktualizacji',
        checkingForLocalCache: 'Sprawdzanie listy modów w lokalnej pamięci podręcznej',
        checkingForThunderstoreUpdates: 'Sprawdzanie aktualizacji listy modów z Thunderstore',
        loadingLatestThunderstoreList: 'Wczytywanie najnowszej listy modów z Thunderstore',
        pruningLocalCache: 'Usuwanie usuniętych modów z lokalnej pamięci podręcznej',
        processingModList: 'Przetwarzanie listy modów',
    }
}
