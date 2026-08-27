import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat'; 
 
export const ModalTranslation: ModalMessageFormat = { 
    failedToSetSteamFolder: { 
        title: 'Nie udało się ustawić folderu Steam', 
        steamExecutableNotSelected: 'Nie wybrano pliku wykonywalnego Steam.', 
        solution: 'Jeśli pojawił się ten błąd, ale plik wykonywalny jest poprawny, uruchom program jako administrator.' 
    }, 
    failedToSetTheGameFolder: { 
        title: 'Nie udało się ustawić folderu {gameName}', 
        listedExecutableNames: 'Plik wykonywalny musi być jednym z następujących: "{options}".', 
        executableMustBeOneOf: 'Wybrany plik wykonywalny musi być jednym z następujących:', 
        solution: 'Jeśli pojawił się ten błąd, ale plik wykonywalny jest poprawny, uruchom program jako administrator.' 
    }, 
    clearingGameDirectory: { 
        title: 'Czyszczenie folderu instalacyjnego {gameName}', 
        waitToLaunchGame: ` 
            Nie będzie można uruchomić gry, dopóki 
            Steam nie zweryfikuje integralności plików gry. 
            `, 
        steamWillBeStarted: ` 
            Steam zostanie uruchomiony i spróbuje zweryfikować 
            integralność gry {gameName}. 
            `, 
        checkSteamForProgress: ` 
            Sprawdź okno Steam, aby zobaczyć postęp weryfikacji. 
            Jeśli okno jeszcze się nie pojawiło, proszę o cierpliwość. 
            `, 
        confirmation: 'Rozumiem' 
    }, 
    dependencyStrings: { 
        title: 'Lista ciągów zależności', 
        dependency: '{modName}-{versionNumber}', 
        close: 'Zamknij' 
    }, 
    launchArguments: { 
        title: 'Ustaw niestandardowe argumenty uruchamiania', 
        someProvidedByDefault: 'Niektóre argumenty są podane domyślnie:', 
        moddedLabel: 'Zmodyfikowana:', 
        availableAfterInstallingLoader: 'Te argumenty będą dostępne po zainstalowaniu mod loadera.', 
        vanillaLabel: 'Vanilla:', 
        pleaseNote: ` 
            Pamiętaj, że są one przekazywane do pliku wykonywalnego Steam. 
            Zachowaj ostrożność podczas wprowadzania niestandardowych argumentów uruchamiania. 
            `, 
        placeholder: 'Wprowadź argumenty', 
        updateArguments: 'Zaktualizuj argumenty uruchamiania', 
    }, 
    categorySelector: { 
        selectCategory: 'Wybierz kategorię', 
        noCategoriesSelected: 'Nie wybrano kategorii', 
    }, 
    importLocalMod: { 
        title: 'Importuj mod z pliku', 
        dialogTitle: 'Importuj lokalny mod z pliku', 
        actions: { 
            selectFile: 'Wybierz plik', 
            importLocalMod: 'Importuj lokalny mod', 
        }, 
        content: { 
            instructToSelect: 'Wybierz plik zip lub DLL do zaimportowania.', 
            dataEntryInfo: ` 
            Pliki zip zawierające plik manifestu będą miały część informacji uzupełnioną automatycznie. 
            Jeśli manifest nie jest dostępny, informacje te trzeba będzie wprowadzić ręcznie. 
            `, 
            waitingForSelection: 'Oczekiwanie na plik. Może to potrwać minutę.', 
            form: { 
                modName: { 
                    label: 'Nazwa moda', 
                    placeholder: 'Wprowadź nazwę moda', 
                }, 
                modAuthor: { 
                    label: 'Autor', 
                    placeholder: 'Wprowadź nazwę autora', 
                }, 
                description: { 
                    label: 'Opis (opcjonalnie)', 
                    placeholder: 'Wprowadź opis' 
                }, 
                version: { 
                    label: 'Wersja', 
                    majorLabel: 'Główna', 
                    minorLabel: 'Pomniejsza', 
                    patchLabel: 'Poprawka' 
                } 
            } 
        }, 
        validationMessages: { 
            modNameEmpty: 'Nazwa moda nie może być pusta.', 
            authorNameEmpty: 'Autor moda nie może być pusty.', 
            invalidVersion: 'Wersja główna, pomniejsza i poprawka muszą być liczbami całkowitymi większymi od 0.', 
            nonNumericVersion: 'Wersja główna, pomniejsza i poprawka muszą być liczbami.', 
            noProfileSelected: 'Nie wybrano profilu.' 
        } 
    }, 
    concerningPackage: { 
        title: 'Przejrzyj {modName}', 
        notFound: 'Ten mod został pierwotnie pobrany z Thunderstore, ale nie jest już dostępny.', 
        whyRemoved: 'Mody mogą zostać usunięte na prośbę autora, z powodu naruszenia zasad lub podczas weryfikacji przez moderatorów.', 
        recommendation: 'Ogólnie zaleca się usunięcie modów, które zostały usunięte z Thunderstore.', 
        exportWarning: 'Inne osoby nie będą mogły zaimportować tego moda z wyeksportowanych profili.', 
        actions: { 
            markSafe: 'Oznacz wersję jako bezpieczną', 
            remove: 'Usuń mod', 
            review: 'Przejrzyj mod', 
        } 
    }, 
    gameRunning: { 
        starting: '{gameName} jest uruchamiana', 
        launchingViaSteam: '{gameName} jest uruchamiana przez Steam', 
        closeToContinue: 'Zamknij ten komunikat, aby kontynuować modowanie.', 
        takingAWhile: 'Jeśli trwa to zbyt długo, prawdopodobnie jest to spowodowane uruchamianiem Steam.', 
        bePatient: 'Proszę o cierpliwość i dobrej zabawy!', 
        close: 'Zamknij', 
    }, 
    error: { 
        title: 'Błąd', 
        suggestion: 'Sugestia', 
        close: 'Zamknij', 
        actions: { 
            showInEnglish: 'Pokaż po angielsku', 
            showTranslated: 'Pokaż przetłumaczone', 
        }, 
    }, 
    disableMod: { 
        title: 'Wyłączanie {modName}', 
        dependantsWarning: 'Inne mody są uzależnione od tego moda. Wybierz {disableAllAction}, aby wyłączyć zależne mody, w przeciwnym razie mogą powodować błędy.', 
        modsToBeDisabled: 'Mody do wyłączenia', 
        actions: { 
            disableAll: 'Wyłącz wszystkie', 
            disableAllRecommended: 'Wyłącz wszystkie (zalecane)', 
            disableOnly: 'Wyłącz tylko {modName}', 
        } 
    }, 
    uninstallMod: { 
        title: 'Odinstalowywanie {modName}', 
        dependantsWarning: 'Inne mody są uzależnione od tego moda. Wybierz {uninstallAllAction}, aby odinstalować zależne mody, w przeciwnym razie mogą powodować błędy.', 
        modsToBeUninstalled: 'Mody do odinstalowania', 
        actions: { 
            uninstallAll: 'Odinstaluj wszystkie', 
            uninstallAllRecommended: 'Odinstaluj wszystkie (zalecane)', 
            uninstallOnly: 'Odinstaluj tylko {modName}', 
        } 
    }, 
    associatedMods: { 
        title: 'Mody powiązane z {modName}', 
        dependencies: 'Zależności', 
        dependants: 'Mody zależne', 
        none: 'Ten mod nie ma żadnych zależności ani modów zależnych.', 
        done: 'Gotowe', 
    }, 
    codeExport: { 
        title: 'Profil wyeksportowany', 
        description: 'Twój kod został skopiowany do schowka, ale można go również skopiować ręcznie poniżej:', 
        done: 'Gotowe', 
        copied: 'Skopiowano do schowka', 
    }, 
    downloadProgress: { 
        states: { 
            downloading: 'Pobieranie {modName}', 
            installing: 'Instalowanie {modName}', 
        }, 
        complete: 'Pobieranie zakończone', 
        close: 'Zamknij', 
        downloadProgress: 'Pobieranie: {progress}% z {totalSize}', 
        installProgress: 'Instalowanie: {progress}%', 
        extractionProgress: 'Rozpakowywanie: {progress}% z {totalSize}', 
        waitingForDownload: 'Instalowanie: oczekiwanie na zakończenie pobierania', 
    }, 
    downloadModVersionSelect: { 
        title: 'Wybierz wersję {modName} do pobrania', 
        content: { 
            recommendedDisclaimer: 'Zaleca się wybranie najnowszej wersji modów.', 
            outdatedModsAdvice: 'Korzystanie z nieaktualnych wersji może powodować problemy.', 
        }, 
        tags: { 
            select: 'Musisz wybrać wersję', 
            recommended: '{version} jest zalecaną wersją', 
            latest: '{version} jest najnowszą wersją', 
            outdated: '{version} jest nieaktualną wersją' 
        }, 
        download: 'Pobierz wraz z zależnościami', 
    }, 
    updateAllInstalledMods: { 
        noModsToUpdate: { 
            title: 'Brak modów do aktualizacji', 
            content: 'Wszystkie zainstalowane mody są aktualne lub nie ma żadnych zainstalowanych modów.', 
            close: 'Zamknij', 
        }, 
        hasModsToUpdate: { 
            title: 'Zaktualizuj wszystkie zainstalowane mody', 
            content: { 
                willBeUpdated: 'Wszystkie zainstalowane mody zostaną zaktualizowane do najnowszych wersji.', 
                missingDependenciesInstalled: 'Wszystkie brakujące zależności zostaną zainstalowane.', 
                whatWillHappen: 'Następujące mody zostaną pobrane i zainstalowane:', 
                modUpdatedTo: '{modName} zostanie zaktualizowany do: {version}', 
            }, 
            updateAll: 'Zaktualizuj wszystkie', 
        } 
    }, 
    launchType: { 
        title: 'Ustaw sposób uruchamiania', 
        auto: { 
            NATIVE: 'Twoja gra zostanie uruchomiona przy użyciu opcji "Native"', 
            PROTON: 'Twoja gra zostanie uruchomiona przy użyciu opcji "Proton"', 
        }, 
        native: { 
            unsureWrapperArgsPresent: 'Nie udało się ustalić, czy wymagane argumenty wrappera zostały ustawione.', 
            addArgumentsInfo: 'Jeśli nie zostało to jeszcze zrobione ręcznie, dodaj następujące argumenty uruchamiania do właściwości gry na Steam:', 
        }, 
        actions: { 
            copyLaunchArgs: 'Kopiuj argumenty uruchamiania', 
            update: 'Aktualizuj' 
        } 
    }, 
    modFilter: { 
        title: 'Filtruj kategorie modów', 
        languageDisclaimer: 'Kategorie są dostarczane przez Thunderstore i nie mogą być tłumaczone.', 
        selectors: { 
            atLeastOneCategory: 'Mody muszą zawierać co najmniej jedną z tych kategorii', 
            allCategories: 'Mody muszą zawierać wszystkie te kategorie', 
            noneCategories: 'Mody nie mogą zawierać żadnej z tych kategorii' 
        }, 
        allowNsfw: 'Zezwalaj na mody NSFW (potencjalnie zawierające treści erotyczne)', 
        showDeprecated: 'Pokaż przestarzałe mody', 
        apply: 'Zastosuj filtry' 
    }, 
    sort: { 
        title: 'Zmień kolejność sortowania modów', 
        sortBehaviour: 'Sposób sortowania', 
        sortDirection: 'Kierunek sortowania', 
        close: 'Zamknij', 
    }, 
    createProfile: { 
        title: 'Utwórz profil', 
        description: 'Ten profil będzie przechowywał własne mody niezależnie od innych profili.', 
        tagStates: { 
            required: 'Musisz wprowadzić nazwę profilu', 
            valid: '"{profileName}" jest prawidłową nazwą profilu', 
            error: '"{profileName}" jest już używana lub zawiera nieprawidłowe znaki' 
        }, 
        actions: { 
            create: 'Utwórz' 
        } 
    }, 
    deleteProfile: { 
        title: 'Usuń profil', 
        content: { 
            resultingAction: 'Spowoduje to usunięcie wszystkich modów oraz ich plików konfiguracyjnych zainstalowanych w tym profilu.', 
            preventAction: 'Jeśli to był wypadek, kliknij zaciemniony obszar lub krzyżyk znajdujący się w prawym górnym rogu.', 
            confirmation: 'Czy na pewno chcesz usunąć ten profil?', 
        }, 
        actions: { 
            delete: 'Usuń profil', 
        } 
    }, 
    renameProfile: { 
        title: 'Zmień nazwę profilu', 
        content: 'Ten profil będzie przechowywał własne mody niezależnie od innych profili.', 
        actions: { 
            rename: 'Zmień nazwę', 
        }, 
        tagStates: { 
            required: 'Musisz wprowadzić nazwę profilu', 
            valid: '"{profileName}" jest prawidłową nazwą profilu', 
            error: '"{profileName}" jest już używana lub zawiera nieprawidłowe znaki' 
        }, 
    }, 
    importProfile: { 
        dialogTitle: 'Importuj profil', 
        dialogButton: 'Importuj', 
        states: { 
            fileCodeSelection: { 
                title: 'Jak importujesz profil?', 
                actions: { 
                    fromFile: 'Z pliku', 
                    fromCode: 'Z kodu' 
                } 
            }, 
            fromFile: { 
                title: 'Wczytywanie pliku', 
                content: 'Pojawi się okno wyboru pliku. Po wybraniu profilu może minąć kilka chwil.', 
            }, 
            importCode: { 
                title: 'Wprowadź kod profilu', 
                enterCodePlaceholder: 'Wprowadź kod profilu', 
                tagStates: { 
                    invalid: 'Nieprawidłowy kod, sprawdź, czy nie ma literówek', 
                }, 
                actions: { 
                    loading: 'Wczytywanie', 
                    proceed: 'Kontynuuj' 
                } 
            }, 
            refresh: { 
                title: 'Odświeżanie listy modów online', 
                content: { 
                    description: ` 
                    Niektóre pakiety w profilu nie są rozpoznawane przez menedżera modów. 
                    Odświeżenie listy modów online może rozwiązać ten problem. Proszę czekać. 
                    `, 
                    waitingForModDownloads: 'Oczekiwanie na zakończenie pobierania modów przed odświeżeniem listy modów online', 
                } 
            }, 
            reviewImport: { 
                title: 'Pakiety do zainstalowania', 
                content: { 
                    notFoundDisclaimer: 'Te pakiety w profilu nie zostały znalezione na Thunderstore i nie zostaną zainstalowane:', 
                    ensureCorrectProfile: 'Upewnij się, że profil jest przeznaczony dla aktualnie wybranej gry.', 
                    packagesWillBeInstalled: 'Te pakiety zostaną zainstalowane:', 
                }, 
                actions: { 
                    acknowledgement: 'Rozumiem, że niektóre mody nie zostaną zaimportowane', 
                    proceed: 'Importuj' 
                } 
            }, 
            willImportOrUpdate: { 
                title: 'Czy chcesz zaktualizować istniejący profil, czy utworzyć nowy?', 
                actions: { 
                    newProfile: 'Importuj nowy profil', 
                    existingProfile: 'Zaktualizuj istniejący profil', 
                } 
            }, 
            addProfile: { 
                title: 'Importuj profil', 
                content: { 
                    create: { 
                        description: 'Ten profil będzie przechowywał własne mody niezależnie od innych profili.' 
                    }, 
                    update: { 
                        contentsWillBeOverwritten: 'Cała zawartość profilu zostanie nadpisana zawartością kodu/pliku.', 
                        selectProfile: 'Wybierz profil poniżej:' 
                    } 
                }, 
                tagStates: { 
                    required: 'Musisz wprowadzić nazwę profilu', 
                    valid: '"{profileName}" jest prawidłową nazwą profilu', 
                    error: '"{profileName}" jest już używana lub zawiera nieprawidłowe znaki' 
                }, 
                actions: { 
                    create: 'Utwórz', 
                    update: 'Zaktualizuj profil: {profileName}' 
                } 
            }, 
            importInProgress: { 
                title: { 
                    downloadingMods: 'Pobieranie modów: {progress}%', 
                    downloadingModsWithGoal: `Pobieranie modów: {progress}% z {totalSize}`, 
                    cleaningUp: 'Czyszczenie', 
                    applyChanges: 'Wprowadzanie zmian w zaktualizowanym profilu', 
                    copyingModsToProfile: 'Kopiowanie modów do profilu: {progress}%', 
                    copyingConfigsToProfile: 'Kopiowanie konfiguracji do profilu: {progress}%' 
 
                }, 
                content: { 
                    waitMessage: 'Może to potrwać chwilę, ponieważ pliki są pobierane, rozpakowywane i kopiowane.', 
                    doNotClose: 'Nie zamykaj aplikacji {appName}.' 
                } 
            } 
        } 
    }, 
    platform: { 
        header: "Który sklep zarządza Twoją grą?", 
        selectAction: "Wybierz platformę", 
    }, 
    settingsLoader: { 
        managerProblem: 'To problem z samym menedżerem modów. Jeśli dostępna jest nowsza wersja menedżera, spróbuj ją zainstalować.', 
        loadFailed: 'Wczytywanie lokalnych ustawień użytkownika nie powiodło się. Możesz użyć przycisku poniżej, aby zresetować ustawienia, ale pamiętaj, że wszystkie ustawienia wszystkich gier zostaną utracone i nie można tego cofnąć.', 
        resetAction: 'Zresetuj ustawienia', 
        resetFailed: 'Resetowanie ustawień nie powiodło się. Nadal możesz spróbować zresetować ustawienia ręcznie, postępując zgodnie z tymi {instructionsLink}.', 
        instructionsLinkText: 'instrukcjami', 
        resetDidNotHelp: 'Lokalnie przechowywane ustawienia zostały zresetowane, ale nie rozwiązało to problemu z ich wczytywaniem. Jeśli dostępna jest nowsza wersja menedżera, spróbuj ją zainstalować.' 
    }, 
    actions: { 
        close: 'Zamknij', 
    }, 
}
