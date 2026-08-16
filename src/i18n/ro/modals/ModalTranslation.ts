import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'A eșuat setarea dosarului pentru Steam',
        steamExecutableNotSelected: 'Executabilul Steam nu a fost selectat.',
        solution: 'Dacă această eroare a apărut și executabilul este corect, te rugăm să rulezi ca administrator.'
    },
    failedToSetTheGameFolder: {
        title: 'A eșuat setarea dosarului pentru {gameName}',
        listedExecutableNames: 'Executabilul trebuie să fie unul din următoarele: "{options}".',
        executableMustBeOneOf: 'Executabilul trebuie să fie oricare din următoarele:',
        solution: 'Dacă această eroare a apărut și executabilul este corect, te rugăm să rulezi ca administrator.'
    },
    clearingGameDirectory: {
        title: 'Curățăm dosarul instalației {gameName}',
        waitToLaunchGame: `
        Nu vei putea lansa jocul până când Steam
        nu a verificat integritatea fișierelelor jocului.
        `,
        steamWillBeStarted: `
        Steam va fi pornit și va încerca să verifice
        integritatea jocului {gameName}.
        `,
        checkSteamForProgress: `
        Te rugăm să verifici progresul validării în fereastra Steam.
        Dacă fereastra nu a apărut încă, te rugăm să ai răbdare.
        `,
        confirmation: 'Am înțeles'
    },
    dependencyStrings: {
        title: 'Lista de identificatori de dependențe',
        dependency: '{modName}-{versionNumber}',
        close: 'Închide'
    },
    launchArguments: {
        title: 'Setează parametri de lansare personalizați',
        someProvidedByDefault: 'Unii parametri sunt furnizați în mod implicit:',
        moddedLabel: 'Cu mod-uri:',
        availableAfterInstallingLoader: 'Acești parametri vor fi disponibili după instalarea unui încărcător de mod-uri.',
        vanillaLabel: 'Vanilla:',
        pleaseNote: `
        Te rugăm să reții faptul că aceștia sunt folosiți la apelul executabilului Steam.
        Fii atent când introduci parametri de lansare personalizați.
        `,
        placeholder: 'Introdu parametri',
        updateArguments: 'Actualizează parametrii de lansare',
    },
    categorySelector: {
        selectCategory: 'Selectează o categorie',
        noCategoriesSelected: 'Nicio categorie selectată',
    },
    importLocalMod: {
        title: 'Importă un mod dintr-un fișier',
        dialogTitle: 'Importă un mod local dintr-un fișier',
        actions: {
            selectFile: 'Selectează fișier',
            importLocalMod: 'Importă modul local',
        },
        content: {
            instructToSelect: 'Te rugăm să selectezi un zip sau un DLL spre a fi importat.',
            dataEntryInfo: `
            Fișierele Zip care conțin un fișier manifest vor avea unele informații precompletate.
            Dacă un manifest nu e disponibil, ele vor trebui să fie introduse manual.
            `,
            waitingForSelection: 'Așteptăm fișierul. Asta ar putea să dureze un pic.',
            form: {
                modName: {
                    label: 'Nume mod',
                    placeholder: 'Introdu numele mod-ului',
                },
                modAuthor: {
                    label: 'Autor',
                    placeholder: 'Introdu numele autorului',
                },
                description: {
                    label: 'Descriere (optional)',
                    placeholder: 'Introdu o descriere'
                },
                version: {
                    label: 'Versiune',
                    majorLabel: 'Major',
                    minorLabel: 'Minor',
                    patchLabel: 'Patch'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Numele modului trebuie să nu fie gol.',
            authorNameEmpty: 'Autorul modului trebuie să nu fie gol.',
            invalidVersion: 'Componentele major, minor, și patch a versiunii trebuie să fie numere mai mari sau egale cu 0.',
            nonNumericVersion: 'Componentele major, minor, și patch a versiunii trebuie să fie numere.',
            noProfileSelected: 'Profilul nu este selectat.'
        }
    },
    concerningPackage: {
        title: 'Revizuiește {modName}',
        notFound: 'Acest mod a fost descărcat inițial din Thunderstore, dar nu mai poate fi găsit pe site.',
        whyRemoved: 'Mod-urile pot fi șterse la cererea autorului, în cazul încălcării regulilor sau în timp ce sunt verificate de către moderatori.',
        recommendation: 'În mod normal, e recomandat să scoți mod-urile care au fost șterse din Thunderstore.',
        exportWarning: 'Alte persoane nu vor putea importa acest mod prin intermediul profilurilor exportate.',
        actions: {
            markSafe: 'Marchează versiunea ca fiind sigură',
            remove: 'Șterge mod-ul',
            review: 'Revizuiește mod-ul',
        }
    },
    gameRunning: {
        starting: '{gameName} este lansat',
        launchingViaSteam: '{gameName} este lansat folosind Steam',
        closeToContinue: 'Închide acest mesaj pentru a continua modding-ul.',
        takingAWhile: 'Dacă asta durează ceva timp, e posibil să fie din cauză că Steam se pornește.',
        bePatient: 'Te rugăm să ai răbdare, și distracție plăcută!',
        close: 'Închide',
    },
    error: {
        title: 'Eroare',
        suggestion: 'Sugestie',
        close: 'Închide',
    },
    disableMod: {
        title: 'Dezactivare {modName}',
        dependantsWarning: 'Alte mod-uri depind de acest mod. Selectează {disableAllAction} ca să dezactivezi mod-urile dependente, altfel ele pot cauza erori.',
        modsToBeDisabled: 'Mod-uri spre a fi dezactivate',
        actions: {
            disableAll: 'Dezactivează toate',
            disableAllRecommended: 'Dezactivează toate (recomandat)',
            disableOnly: 'Dezactivează doar {modName}',
        }
    },
    uninstallMod: {
        title: 'Dezinstalare {modName}',
        dependantsWarning: 'Alte mod-uri depind de acest mod. Selectează {uninstallAllAction} ca să dezinstalezi mod-urile dependente, altfel ele pot cauza erori.',
        modsToBeUninstalled: 'Mod-uri spre a fi dezinstalate',
        actions: {
            uninstallAll: 'Dezinstalează toate',
            uninstallAllRecommended: 'Dezinstalează toate (recomandat)',
            uninstallOnly: 'Dezinstalează doar {modName}',
        }
    },
    associatedMods: {
        title: 'Mod-uri asociate cu {modName}',
        dependencies: 'Dependențe',
        dependants: 'Mod-uri dependente',
        none: 'Acest mod nu are dependențe sau mod-uri dependente.',
        done: 'Gata',
    },
    codeExport: {
        title: 'Profil exportat',
        description: 'Codul tău a fost copiat în clipboard, dar poate fi copiat și de mai jos:',
        done: 'Gata',
        copied: 'Copiat în clipboard',
    },
    downloadProgress: {
        states: {
            downloading: 'Descărcare {modName}',
            installing: 'Instalare {modName}',
        },
        complete: 'Descărcare completă',
        close: 'Închide',
        downloadProgress: 'Descărcare: {progress}% din {totalSize}',
        installProgress: 'Instalare: {progress}%',
        extractionProgress: 'Extragere: {progress}% din {totalSize}',
        waitingForDownload: 'Instalare: așteptăm ca descărcarea să se finiseze',
    },
    downloadModVersionSelect: {
        title: 'Selectează o versiune a {modName} spre a fi descărcată',
        content: {
            recommendedDisclaimer: 'E recomandat să selectezi cea mai actuală versiune a mod-urilor.',
            outdatedModsAdvice: 'Folosirea versiunilor învechite poate cauza probleme.',
        },
        tags: {
            select: 'Trebuie să selectezi o versiune',
            recommended: '{version} e versiunea recomandată',
            latest: '{version} e cea mai actuală versiune',
            outdated: '{version} e o versiune învechită'
        },
        download: 'Descarcă împreună cu dependențele',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'Niciun mod de actualizat',
            content: 'Ori toate mod-urile instalate sunt la zi, ori nu există mod-uri instalate.',
            close: 'Închide',
        },
        hasModsToUpdate: {
            title: 'Actualizează toate mod-urile instalate',
            content: {
                willBeUpdated: 'Toate mod-urile instalate vor fi actualizate la ultimele lor versiuni.',
                missingDependenciesInstalled: 'Orice dependență lipsă va fi instalată.',
                whatWillHappen: 'Următoarele mod-uri vor fi descărcate și instalate:',
                modUpdatedTo: '{modName} va fi actualizat la: {version}',
            },
            updateAll: 'Actualizează toate',
        }
    },
    launchType: {
        title: 'Setează comportamentul de lansare',
        auto: {
            NATIVE: 'Jocul tău va fi lansat folosind opțiunea ”Nativ”',
            PROTON: 'Jocul tău va fi lansat folosind opțiunea ”Proton”',
        },
        native: {
            unsureWrapperArgsPresent: 'Nu am putut determina dacă parametrii wrapper necesari au fost setați.',
            addArgumentsInfo: 'Dacă încă nu ai făcut asta manual, te rugăm să adaugi următorii parametri de lansare în cadrul proprietăților jocului din Steam:',
        },
        actions: {
            copyLaunchArgs: 'Copie parametrii de lansare',
            update: 'Actualizează'
        }
    },
    modFilter: {
        title: 'Filtrează categoriile de mod-uri',
        languageDisclaimer: 'Categoriile sunt furnizate de către Thunderstore și nu pot fi traduse.',
        selectors: {
            atLeastOneCategory: 'Mod-urile trebuie să conțină măcar una dintre aceste categorii',
            allCategories: 'Mod-urile trebuie să conțină toate aceste categorii',
            noneCategories: 'Mod-urile nu pot conține niciuna dintre aceste categorii'
        },
        allowNsfw: 'Permite mod-uri NSFW (potențial explicite)',
        showDeprecated: 'Afișează mod-urile scoase din uz',
        apply: 'Aplică filtrele'
    },
    sort: {
        title: 'Schimbă ordonarea mod-urilor',
        sortBehaviour: 'Modalitatea de ordonare',
        sortDirection: 'Direcția de ordonare',
        close: 'Închide',
    },
    createProfile: {
        title: 'Crează un profil',
        description: 'Acest profil își va stoca mod-urile independent de restul profilurilor.',
        tagStates: {
            required: 'Trebuie să introduci un nume de profil',
            valid: '"{profileName}" este un nume de profil valid',
            error: '"{profileName}" ori este deja folosit, ori conține caractere nevalide.'
        },
        actions: {
            create: 'Crează'
        }
    },
    deleteProfile: {
        title: 'Șterge un profil',
        content: {
            resultingAction: 'Asta va șterge toate mod-urile și fișierele lor de configurare instalate în cadrul acestui profil.',
            preventAction: 'Dacă ai ajuns aici accidental, apasă ori în zona întunecată, ori pe crucea din dreapta sus.',
            confirmation: 'Sigur că vrei să ștergi acest profil?',
        },
        actions: {
            delete: 'Șterge profilul',
        }
    },
    renameProfile: {
        title: 'Redenumește un profil',
        content: 'Acest profil își va stoca mod-urile independent de restul profilurilor.',
        actions: {
            rename: 'Redenumește',
        },
        tagStates: {
            required: 'Trebuie să introduci un nume de profil',
            valid: '"{profileName}" este un nume de profil valid',
            error: '"{profileName}" ori este deja folosit, ori conține caractere nevalide.'
        },
    },
    importProfile: {
        dialogTitle: 'Importă un profil',
        dialogButton: 'Importă',
        states: {
            fileCodeSelection: {
                title: 'Prin care modalitate vrei să imporți profilul?',
                actions: {
                    fromFile: 'Folosind un fișier',
                    fromCode: 'Folosind un cod'
                }
            },
            fromFile: {
                title: 'Încărcare fișier',
                content: 'Va apărea o fereastră de selecție a fișierului. După ce un profil a fost selectat, va fi nevoie de ceva timp.',
            },
            importCode: {
                title: 'Introdu codul profilului',
                enterCodePlaceholder: 'Introdu codul profilului',
                tagStates: {
                    invalid: 'Cod nevalid, verifică dacă e corect',
                },
                actions: {
                    loading: 'Încărcare',
                    proceed: 'Continuă'
                }
            },
            refresh: {
                title: 'Actualizare listă de mod-uri online',
                content: {
                    description: `
                    Unele pachete din acest profil nu sunt recunoscute de către managerul de mod-uri.
                    Actualizarea listei de mod-uri online ar putea rezolva această problemă. Te rugăm să aștepți.
                    `,
                    waitingForModDownloads: 'Așteptăm ca descărcările de mod-uri să se termine înainte de a actualiza lista de mod-uri online',
                }
            },
            reviewImport: {
                title: 'Pachete spre a fi instalate',
                content: {
                    notFoundDisclaimer: 'Aceste pachete din cadrul profilului nu au fost găsite pe Thunderstore și nu vor fi instalate:',
                    ensureCorrectProfile: 'Asigură-te că profilul a fost intenționat spre a fi folosit pentru jocul selectat la moment.',
                    packagesWillBeInstalled: 'Aceste pachete vor fi instalate:',
                },
                actions: {
                    acknowledgement: 'Înțeleg că unele moduri nu vor fi importate',
                    proceed: 'Importă'
                }
            },
            willImportOrUpdate: {
                title: 'Vrei să actualizezi un profil existent sau să creezi unul nou?',
                actions: {
                    newProfile: 'Importă un profil nou',
                    existingProfile: 'Actualizează un profil existent',
                }
            },
            addProfile: {
                title: 'Importă un profil',
                content: {
                    create: {
                        description: 'Acest profil își va stoca mod-urile independent de restul profilurilor.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'Toate conținuturile profilului vor fi suprascrise folosind conținuturile codului/fișierului.',
                        selectProfile: 'Selectează un profil de mai jos:'
                    }
                },
                tagStates: {
                    required: 'Trebuie să introduci un nume de profil',
                    valid: '"{profileName}" este un nume de profil valid',
                    error: '"{profileName}" ori este deja folosit, ori conține caractere nevalide.'
                },
                actions: {
                    create: 'Crează',
                    update: 'Actualizează profilul: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Descărcăm mod-uri: {progress}%',
                    downloadingModsWithGoal: `Descărcăm mod-uri: {progress}% din {totalSize}`,
                    cleaningUp: 'Facem curățenie',
                    applyChanges: 'Aplicăm schimbările asupra profilului actualizat',
                    copyingModsToProfile: 'Copiem mod-urile în profil: {progress}%',
                    copyingConfigsToProfile: 'Copiem configurațiile în profil: {progress}%'

                },
                content: {
                    waitMessage: 'Asta ar putea lua ceva timp, întrucât fișierele sunt în curs de descărcare, extragere și copiere.',
                    doNotClose: 'Te rugăm să nu închizi {appName}.'
                }
            }
        }
    },
    platform: {
        header: "Care magazin gestionează jocul tău?",
        selectAction: "Selectează platforma",
    },
    settingsLoader: {
        managerProblem: 'Aceasta este o problemă cu managerul de mod-uri în sine. Dacă este disponibilă o versiune mai nouă a managerului, încearcă să o instalezi.',
        loadFailed: 'Încărcarea setărilor de utilizator locale a eșuat. Poți folosi butonul de mai jos ca să resetezi setările, dar fii atent că toate setările pentru toate jocurile vor fi pierdute fără posibilitatea de a le restaura.',
        resetAction: 'Resetează setările',
        resetFailed: 'Resetarea setărilor a eșuat. Mai poți să încerci să resetezi setările manual folosind următoarele {instructionsLink}.',
        instructionsLinkText: 'instrucțiuni',
        resetDidNotHelp: 'Setările stocate local au fost resetate, dar asta nu a rezolvat problema cu încărcarea setărilor. acă este disponibilă o versiune mai nouă a managerului, încearcă să o instalezi.'
    },
    actions: {
        close: 'Închide',
    },
}
