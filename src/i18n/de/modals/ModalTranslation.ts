import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Steam-Ordner konnte nicht festgelegt werden',
        steamExecutableNotSelected: 'Die Steam-Executable wurde nicht ausgewählt.',
        solution: 'Wenn dieser Fehler angezeigt wird, obwohl die Executable korrekt ist, führe das Programm bitte als Administrator aus.'
    },
    failedToSetTheGameFolder: {
        title: 'Der {gameName}-Ordner konnte nicht festgelegt werden',
        listedExecutableNames: 'Die Executable muss eine der folgenden sein: "{options}".',
        executableMustBeOneOf: 'Die ausgewählte Executable muss eine der folgenden sein:',
        solution: 'Wenn dieser Fehler angezeigt wird, obwohl die Executable korrekt ist, führe das Programm bitte als Administrator aus.'
    },
    clearingGameDirectory: {
        title: 'Installationsverzeichnis von {gameName} wird geleert',
        waitToLaunchGame: `
            Du kannst das Spiel erst starten, wenn
            Steam die Integrität der Spieldateien überprüft hat.
            `,
        steamWillBeStarted: `
            Steam wird gestartet und versucht, die
            Integrität von {gameName} zu überprüfen.
            `,
        checkSteamForProgress: `
            Bitte überprüfe das Steam-Fenster auf den Fortschritt der Überprüfung.
            Falls das Fenster noch nicht angezeigt wird, habe bitte etwas Geduld.
            `,
        confirmation: 'Ich verstehe'
    },
    dependencyStrings: {
        title: 'Liste der Abhängigkeiten',
        dependency: '{modName}-{versionNumber}',
        close: 'Schließen'
    },
    launchArguments: {
        title: 'Benutzerdefinierte Startargumente festlegen',
        someProvidedByDefault: 'Einige Argumente werden standardmäßig bereitgestellt:',
        moddedLabel: 'Modifiziert:',
        availableAfterInstallingLoader: 'Diese Argumente sind nach der Installation eines Mod Loaders verfügbar.',
        vanillaLabel: 'Vanilla:',
        pleaseNote: `
            Bitte beachte, dass diese Argumente für die Steam-Executable verwendet werden.
            Sei vorsichtig bei der Eingabe benutzerdefinierter Startargumente.
            `,
        placeholder: 'Argumente eingeben',
        updateArguments: 'Startargumente aktualisieren',
    },
    categorySelector: {
        selectCategory: 'Kategorie auswählen',
        noCategoriesSelected: 'Keine Kategorien ausgewählt',
    },
    importLocalMod: {
        title: 'Mod aus Datei importieren',
        dialogTitle: 'Lokale Mod aus Datei importieren',
        actions: {
            selectFile: 'Datei auswählen',
            importLocalMod: 'Lokale Mod importieren',
        },
        content: {
            instructToSelect: 'Bitte wähle eine ZIP-Datei oder DLL zum Importieren aus.',
            dataEntryInfo: `
            ZIP-Dateien, die eine Manifestdatei enthalten, werden teilweise automatisch ausgefüllt.
            Wenn kein Manifest vorhanden ist, müssen die Angaben manuell eingegeben werden.
            `,
            waitingForSelection: 'Warten auf Datei. Dies kann eine Minute dauern.',
            form: {
                modName: {
                    label: 'Mod-Name',
                    placeholder: 'Namen der Mod eingeben',
                },
                modAuthor: {
                    label: 'Autor',
                    placeholder: 'Namen des Autors eingeben',
                },
                description: {
                    label: 'Beschreibung (optional)',
                    placeholder: 'Beschreibung eingeben'
                },
                version: {
                    label: 'Version',
                    majorLabel: 'Major',
                    minorLabel: 'Minor',
                    patchLabel: 'Patch'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Der Mod-Name darf nicht leer sein.',
            authorNameEmpty: 'Der Name des Mod-Autors darf nicht leer sein.',
            invalidVersion: 'Major, Minor und Patch müssen ganze Zahlen größer als 0 sein.',
            nonNumericVersion: 'Major, Minor und Patch müssen Zahlen sein.',
            noProfileSelected: 'Es wurde kein Profil ausgewählt.'
        }
    },
    concerningPackage: {
        title: '{modName} überprüfen',
        notFound: 'Diese Mod wurde ursprünglich von Thunderstore heruntergeladen, ist aber auf der Website nicht mehr verfügbar.',
        whyRemoved: 'Mods können auf Wunsch des Autors, wegen Regelverstößen oder während einer Überprüfung durch Moderatoren entfernt werden.',
        recommendation: 'Es wird generell empfohlen, Mods zu entfernen, die von Thunderstore entfernt wurden.',
        exportWarning: 'Andere Personen können diese Mod nicht aus exportierten Profilen importieren.',
        actions: {
            markSafe: 'Version als sicher markieren',
            remove: 'Mod entfernen',
            review: 'Mod überprüfen',
        }
    },
    gameRunning: {
        starting: '{gameName} wird gestartet',
        launchingViaSteam: '{gameName} wird über Steam gestartet',
        closeToContinue: 'Schließe diese Meldung, um mit dem Modden fortzufahren.',
        takingAWhile: 'Wenn dies eine Weile dauert, liegt es wahrscheinlich daran, dass Steam gestartet wird.',
        bePatient: 'Bitte habe etwas Geduld und viel Spaß!',
        close: 'Schließen',
    },
    error: {
        title: 'Fehler',
        suggestion: 'Vorschlag',
        close: 'Schließen',
        actions: {
            showInEnglish: 'Auf Englisch anzeigen',
            showTranslated: 'Übersetzung anzeigen',
        },
    },
    disableMod: {
        title: '{modName} deaktivieren',
        dependantsWarning: 'Andere Mods sind von dieser Mod abhängig. Wähle {disableAllAction}, um abhängige Mods zu deaktivieren, da sie sonst Fehler verursachen können.',
        modsToBeDisabled: 'Zu deaktivierende Mods',
        actions: {
            disableAll: 'Alle deaktivieren',
            disableAllRecommended: 'Alle deaktivieren (empfohlen)',
            disableOnly: 'Nur {modName} deaktivieren',
        }
    },
    uninstallMod: {
        title: '{modName} deinstallieren',
        dependantsWarning: 'Andere Mods sind von dieser Mod abhängig. Wähle {uninstallAllAction}, um abhängige Mods zu deinstallieren, da sie sonst Fehler verursachen können.',
        modsToBeUninstalled: 'Zu deinstallierende Mods',
        actions: {
            uninstallAll: 'Alle deinstallieren',
            uninstallAllRecommended: 'Alle deinstallieren (empfohlen)',
            uninstallOnly: 'Nur {modName} deinstallieren',
        }
    },
    associatedMods: {
        title: 'Mit {modName} verbundene Mods',
        dependencies: 'Abhängigkeiten',
        dependants: 'Abhängige Mods',
        none: 'Diese Mod hat keine Abhängigkeiten oder abhängigen Mods.',
        done: 'Fertig',
    },
    codeExport: {
        title: 'Profil exportiert',
        description: 'Dein Code wurde in die Zwischenablage kopiert, kann aber auch manuell unten kopiert werden:',
        done: 'Fertig',
        copied: 'In die Zwischenablage kopiert',
    },
    downloadProgress: {
        states: {
            downloading: '{modName} wird heruntergeladen',
            installing: '{modName} wird installiert',
        },
        complete: 'Download abgeschlossen',
        close: 'Schließen',
        downloadProgress: 'Download: {progress}% von {totalSize}',
        installProgress: 'Installation: {progress}%',
        extractionProgress: 'Entpacken: {progress}% von {totalSize}',
        waitingForDownload: 'Installation: Warten auf Abschluss des Downloads',
    },
    downloadModVersionSelect: {
        title: 'Version von {modName} zum Herunterladen auswählen',
        content: {
            recommendedDisclaimer: 'Es wird empfohlen, die neueste Version aller Mods auszuwählen.',
            outdatedModsAdvice: 'Die Verwendung veralteter Versionen kann zu Problemen führen.',
        },
        tags: {
            select: 'Du musst eine Version auswählen',
            recommended: '{version} ist die empfohlene Version',
            latest: '{version} ist die neueste Version',
            outdated: '{version} ist eine veraltete Version'
        },
        download: 'Mit Abhängigkeiten herunterladen',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'Keine Mods zu aktualisieren',
            content: 'Entweder sind alle installierten Mods auf dem neuesten Stand oder es sind keine Mods installiert.',
            close: 'Schließen',
        },
        hasModsToUpdate: {
            title: 'Alle installierten Mods aktualisieren',
            content: {
                willBeUpdated: 'Alle installierten Mods werden auf ihre neuesten Versionen aktualisiert.',
                missingDependenciesInstalled: 'Fehlende Abhängigkeiten werden installiert.',
                whatWillHappen: 'Die folgenden Mods werden heruntergeladen und installiert:',
                modUpdatedTo: '{modName} wird auf {version} aktualisiert',
            },
            updateAll: 'Alle aktualisieren',
        }
    },
    launchType: {
        title: 'Startverhalten festlegen',
        auto: {
            NATIVE: 'Dein Spiel wird mit der Option "Native" gestartet',
            PROTON: 'Dein Spiel wird mit der Option "Proton" gestartet',
        },
        native: {
            unsureWrapperArgsPresent: 'Wir konnten nicht feststellen, ob die erforderlichen Wrapper-Argumente gesetzt wurden.',
            addArgumentsInfo: 'Falls du dies noch nicht manuell getan hast, füge bitte die folgenden Startargumente in den Eigenschaften des Spiels auf Steam hinzu:',
        },
        actions: {
            copyLaunchArgs: 'Startargumente kopieren',
            update: 'Aktualisieren'
        }
    },
    modFilter: {
        title: 'Mod-Kategorien filtern',
        languageDisclaimer: 'Kategorien werden von Thunderstore bereitgestellt und können nicht übersetzt werden.',
        selectors: {
            atLeastOneCategory: 'Mods müssen mindestens eine dieser Kategorien enthalten',
            allCategories: 'Mods müssen alle diese Kategorien enthalten',
            noneCategories: 'Mods dürfen keine dieser Kategorien enthalten'
        },
        allowNsfw: 'NSFW-Mods (potenziell explizit) zulassen',
        showDeprecated: 'Veraltete Mods anzeigen',
        apply: 'Filter anwenden'
    },
    sort: {
        title: 'Reihenfolge der Mods ändern',
        sortBehaviour: 'Sortierverhalten',
        sortDirection: 'Sortierrichtung',
        close: 'Schließen',
    },
    createProfile: {
        title: 'Profil erstellen',
        description: 'Dieses Profil speichert seine eigenen Mods unabhängig von anderen Profilen.',
        tagStates: {
            required: 'Du musst einen Profilnamen eingeben',
            valid: '"{profileName}" ist ein gültiger Profilname',
            error: '"{profileName}" wird bereits verwendet oder enthält ungültige Zeichen'
        },
        actions: {
            create: 'Erstellen'
        }
    },
    deleteProfile: {
        title: 'Profil löschen',
        content: {
            resultingAction: 'Dadurch werden alle in diesem Profil installierten Mods und deren Konfigurationsdateien entfernt.',
            preventAction: 'Falls dies ein Versehen war, klicke entweder auf den abgedunkelten Bereich oder auf das Kreuz oben rechts.',
            confirmation: 'Möchtest du dieses Profil wirklich löschen?',
        },
        actions: {
            delete: 'Profil löschen',
        }
    },
    renameProfile: {
        title: 'Profil umbenennen',
        content: 'Dieses Profil speichert seine eigenen Mods unabhängig von anderen Profilen.',
        actions: {
            rename: 'Umbenennen',
        },
        tagStates: {
            required: 'Du musst einen Profilnamen eingeben',
            valid: '"{profileName}" ist ein gültiger Profilname',
            error: '"{profileName}" wird bereits verwendet oder enthält ungültige Zeichen'
        },
    },
    importProfile: {
        dialogTitle: 'Profil importieren',
        dialogButton: 'Importieren',
        states: {
            fileCodeSelection: {
                title: 'Wie möchtest du ein Profil importieren?',
                actions: {
                    fromFile: 'Aus Datei',
                    fromCode: 'Aus Code'
                }
            },
            fromFile: {
                title: 'Datei wird geladen',
                content: 'Ein Dateiauswahlfenster wird angezeigt. Sobald ein Profil ausgewählt wurde, kann es einige Augenblicke dauern.',
            },
            importCode: {
                title: 'Profilcode eingeben',
                enterCodePlaceholder: 'Profilcode eingeben',
                tagStates: {
                    invalid: 'Ungültiger Code, überprüfe die Eingabe auf Tippfehler',
                },
                actions: {
                    loading: 'Wird geladen',
                    proceed: 'Weiter'
                }
            },
            refresh: {
                title: 'Online-Mod-Liste wird aktualisiert',
                content: {
                    description: `
                    Einige Pakete im Profil werden vom Mod-Manager nicht erkannt.
                    Eine Aktualisierung der Online-Mod-Liste könnte das Problem beheben. Bitte warte.
                    `,
                    waitingForModDownloads: 'Warten auf den Abschluss der Mod-Downloads, bevor die Online-Mod-Liste aktualisiert wird',
                }
            },
            reviewImport: {
                title: 'Zu installierende Pakete',
                content: {
                    notFoundDisclaimer: 'Diese Pakete im Profil wurden auf Thunderstore nicht gefunden und werden nicht installiert:',
                    ensureCorrectProfile: 'Stelle sicher, dass das Profil für das aktuell ausgewählte Spiel bestimmt ist.',
                    packagesWillBeInstalled: 'Diese Pakete werden installiert:',
                },
                actions: {
                    acknowledgement: 'Ich verstehe, dass einige der Mods nicht importiert werden',
                    proceed: 'Importieren'
                }
            },
            willImportOrUpdate: {
                title: 'Möchtest du ein vorhandenes Profil aktualisieren oder ein neues erstellen?',
                actions: {
                    newProfile: 'Neues Profil importieren',
                    existingProfile: 'Vorhandenes Profil aktualisieren',
                }
            },
            addProfile: {
                title: 'Profil importieren',
                content: {
                    create: {
                        description: 'Dieses Profil speichert seine eigenen Mods unabhängig von anderen Profilen.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'Alle Inhalte des Profils werden mit den Inhalten des Codes/der Datei überschrieben.',
                        selectProfile: 'Wähle unten ein Profil aus:'
                    }
                },
                tagStates: {
                    required: 'Du musst einen Profilnamen eingeben',
                    valid: '"{profileName}" ist ein gültiger Profilname',
                    error: '"{profileName}" wird bereits verwendet oder enthält ungültige Zeichen'
                },
                actions: {
                    create: 'Erstellen',
                    update: 'Profil aktualisieren: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Mods werden heruntergeladen: {progress}%',
                    downloadingModsWithGoal: `Mods werden heruntergeladen: {progress}% von {totalSize}`,
                    cleaningUp: 'Aufräumen',
                    applyChanges: 'Änderungen am aktualisierten Profil werden angewendet',
                    copyingModsToProfile: 'Mods werden ins Profil kopiert: {progress}%',
                    copyingConfigsToProfile: 'Konfigurationen werden ins Profil kopiert: {progress}%'

                },
                content: {
                    waitMessage: 'Dies kann eine Weile dauern, da Dateien heruntergeladen, entpackt und kopiert werden.',
                    doNotClose: 'Bitte schließe {appName} nicht.'
                }
            }
        }
    },
    platform: {
        header: "Welcher Store verwaltet dein Spiel?",
        selectAction: "Plattform auswählen",
    },
    settingsLoader: {
        managerProblem: 'Dies ist ein Problem mit dem Mod-Manager selbst. Falls eine neuere Version des Managers verfügbar ist, versuche, sie zu installieren.',
        loadFailed: 'Das Laden der lokalen Benutzereinstellungen ist fehlgeschlagen. Du kannst die Einstellungen mit der Schaltfläche unten zurücksetzen. Beachte jedoch, dass dadurch alle Einstellungen für alle Spiele gelöscht werden und dies nicht rückgängig gemacht werden kann.',
        resetAction: 'Einstellungen zurücksetzen',
        resetFailed: 'Das Zurücksetzen der Einstellungen ist fehlgeschlagen. Du kannst trotzdem versuchen, die Einstellungen manuell zurückzusetzen, indem du diesen {instructionsLink} folgst.',
        instructionsLinkText: 'Anweisungen',
        resetDidNotHelp: 'Die lokal gespeicherten Einstellungen wurden zurückgesetzt, aber das Problem beim Laden der Einstellungen wurde dadurch nicht behoben. Falls eine neuere Version des Managers verfügbar ist, versuche, sie zu installieren.'
    },
    actions: {
        close: 'Schließen',
    },
}
