import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: 'Échec de la configuration du dossier Steam',
        steamExecutableNotSelected: 'L\'exécutable Steam n\'a pas été sélectionné.',
        solution: 'Si cette erreur apparaît alors que l\'exécutable est correct, veuillez exécuter en tant qu\'administrateur.'
    },
    failedToSetTheGameFolder: {
        title: 'Échec de la configuration du dossier {gameName}',
        listedExecutableNames: 'L\'exécutable doit être l\'un des suivants : "{options}".',
        executableMustBeOneOf: 'L\'exécutable sélectionné doit être l\'un des suivants :',
        solution: 'Si cette erreur apparaît alors que l\'exécutable est correct, veuillez exécuter en tant qu\'administrateur.'
    },
    clearingGameDirectory: {
        title: 'Nettoyage du dossier d\'installation de {gameName}',
        waitToLaunchGame: 'Vous ne pourrez pas lancer le jeu tant que Steam n\'aura pas vérifié l\'intégrité des fichiers du jeu.',
        steamWillBeStarted: 'Steam va démarrer et tenter de vérifier l\'intégrité de {gameName}.',
        checkSteamForProgress: `
        Veuillez vérifier la fenêtre de Steam pour l'avancement de la validation.
        Si la fenêtre n'est pas encore apparue, veuillez patienter.
        `,
        confirmation: 'Je comprends'
    },
    dependencyStrings: {
        title: 'Liste des chaînes de dépendance',
        dependency: '{modName}-{versionNumber}',
        close: 'Fermer'
    },
    launchArguments: {
        title: 'Définir des arguments de lancement personnalisés',
        someProvidedByDefault: 'Certains arguments sont fournis par défaut :',
        moddedLabel: 'Moddé :',
        availableAfterInstallingLoader: 'Ces arguments seront disponibles après l\'installation d\'un chargeur de mods.',
        vanillaLabel: 'Base :',
        pleaseNote: `
            Veuillez noter que ceux-ci sont appelés via l'exécutable Steam.
            Soyez prudent en saisissant des arguments de lancement personnalisés.
            `,
        placeholder: 'Saisissez les arguments',
        updateArguments: 'Mettre à jour',
    },
    categorySelector: {
        selectCategory: 'Sélectionnez une catégorie',
        noCategoriesSelected: 'Aucune catégorie sélectionnée',
    },
    importLocalMod: {
        title: 'Importer un mod depuis un fichier',
        actions: {
            selectFile: 'Sélectionner un fichier',
            importLocalMod: 'Importer un mod local',
        },
        content: {
            instructToSelect: 'Veuillez sélectionner un fichier zip ou DLL à importer.',
            dataEntryInfo: `
            Les fichiers zip qui contiennent un fichier manifeste verront certaines informations pré-remplies.
            Si un manifeste n'est pas disponible, celles-ci devront être saisies manuellement.
            `,
            waitingForSelection: 'En attente de la sélection d\'un fichier. Cela peut prendre une minute.',
            form: {
                modName: {
                    label: 'Nom du mod',
                    placeholder: 'Saisissez le nom du mod',
                },
                modAuthor: {
                    label: 'Auteur',
                    placeholder: 'Saisissez le nom de l\'auteur',
                },
                description: {
                    label: 'Description (facultatif)',
                    placeholder: 'Saisissez une description'
                },
                version: {
                    label: 'Version',
                    majorLabel: 'Majeure',
                    minorLabel: 'Mineure',
                    patchLabel: 'Correctif'
                }
            }
        },
        validationMessages: {
            modNameEmpty: 'Le nom du mod ne doit pas être vide.',
            authorNameEmpty: 'L\'auteur du mod ne doit pas être vide.',
            invalidVersion: 'Majeur, mineur et correctif doivent être des nombres entiers supérieurs à 0.',
            nonNumericVersion: 'Majeur, mineur et correctif doivent tous être des nombres.',
            noProfileSelected: 'Le profil n\'est pas sélectionné.'
        }
    },
    concerningPackage: {
        title: 'Vérifier {modName}',
        notFound: 'Ce mod a été téléchargé depuis Thunderstore, mais il est désormais introuvable sur le site.',
        whyRemoved: 'Un mod peut être retiré à la demande de son auteur, en cas de non-respect des règles, ou pendant sa vérification par les modérateurs.',
        recommendation: 'Il est généralement recommandé de supprimer les mods qui ont été retirés de Thunderstore.',
        exportWarning: 'Les autres utilisateurs ne pourront pas importer ce mod depuis des profils exportés.',
        actions: {
            markSafe: 'Marquer cette version comme sûre',
            remove: 'Supprimer le mod',
            review: 'Vérifier le mod',
        }
    },
    gameRunning: {
        starting: '{gameName} démarre',
        launchingViaSteam: '{gameName} se lance via Steam',
        closeToContinue: 'Fermez ce message pour continuer à modder.',
        takingAWhile: 'Si cela prend du temps, c\'est probablement dû au démarrage de Steam.',
        bePatient: 'Merci de patienter, et amusez-vous bien !',
        close: 'Fermer',
    },
    error: {
        title: 'Erreur',
        suggestion: 'Suggestion',
        close: 'Fermer',
    },
    disableMod: {
        title: 'Désactivation de {modName}',
        dependantsWarning: 'D\'autres mods dépendent de ce mod. Sélectionnez {disableAllAction} pour désactiver les mods dépendants, sinon ils risquent de provoquer des erreurs.',
        modsToBeDisabled: 'Mods à désactiver',
        actions: {
            disableAll: 'Tout désactiver',
            disableAllRecommended: 'Tout désactiver (recommandé)',
            disableOnly: 'Désactiver uniquement {modName}',
        }
    },
    uninstallMod: {
        title: 'Désinstallation de {modName}',
        dependantsWarning: 'D\'autres mods dépendent de ce mod. Sélectionnez {uninstallAllAction} pour désinstaller les mods dépendants, sinon ils risquent de provoquer des erreurs.',
        modsToBeUninstalled: 'Mods à désinstaller',
        actions: {
            uninstallAll: 'Tout désinstaller',
            uninstallAllRecommended: 'Tout désinstaller (recommandé)',
            uninstallOnly: 'Désinstaller uniquement {modName}',
        }
    },
    associatedMods: {
        title: 'Mods associés à {modName}',
        dependencies: 'Dépendances',
        dependants: 'Mods dépendants',
        none: 'Ce mod n\'a aucune dépendance et aucun mod n\'en dépend.',
        done: 'Terminé',
    },
    codeExport: {
        title: 'Profil exporté',
        description: 'Votre code a été copié dans votre presse-papiers, mais peut également être copié manuellement ci-dessous :',
        done: 'Terminé',
    },
    downloadProgress: {
        states: {
            downloading: 'Téléchargement de {modName}',
            installing: 'Installation de {modName}',
        },
        complete: 'Téléchargement terminé',
        close: 'Fermer',
        downloadProgress: 'Téléchargement en cours : {progress} % sur {totalSize}',
        installProgress: 'Installation en cours : {progress} % terminée',
        waitingForDownload: 'Installation en cours : en attente de la fin du téléchargement',
        extractionProgress: 'Extraction : {progress} % de {totalSize}'
    },
    downloadModVersionSelect: {
        title: 'Sélectionnez une version de {modName} à télécharger',
        content: {
            recommendedDisclaimer: 'Il est recommandé de sélectionner la dernière version de tous les mods.',
            outdatedModsAdvice: 'L\'utilisation de versions obsolètes peut causer des problèmes.',
        },
        tags: {
            select: 'Vous devez sélectionner une version',
            recommended: '{version} est la version recommandée',
            latest: '{version} est la dernière version',
            outdated: '{version} n\'est pas à jour'
        },
        download: 'Télécharger avec les dépendances',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: 'Aucun mod à mettre à jour',
            content: 'Soit tous les mods installés sont à jour soit il n\'y a aucun mod d\'installé.',
            close: 'Fermer',
        },
        hasModsToUpdate: {
            title: 'Mettre à jour tous les mods installés',
            content: {
                willBeUpdated: 'Tous les mods installés seront mis à jour vers leurs dernières versions.',
                missingDependenciesInstalled: 'Toutes les dépendances manquantes seront installées.',
                whatWillHappen: 'Les mods suivants seront téléchargés et installés :',
                modUpdatedTo: '{modName} sera mis à jour vers : {version}',
            },
            updateAll: 'Tout mettre à jour',
        }
    },
    launchType: {
        title: 'Définir le comportement de lancement',
        auto: {
            NATIVE: 'Votre jeu sera démarré avec l\'option "Natif"',
            PROTON: 'Votre jeu sera démarré avec l\'option "Proton"',
        },
        native: {
            unsureWrapperArgsPresent: 'Nous n\'avons pas pu déterminer si les arguments de wrapper requis ont été définis.',
            addArgumentsInfo: 'Si vous ne l\'avez pas encore fait manuellement, veuillez ajouter les arguments de lancement suivants dans les propriétés du jeu sur Steam :',
        },
        actions: {
            copyLaunchArgs: 'Copier les arguments',
            update: 'Mettre à jour'
        }
    },
    modFilter: {
        title: 'Filtrer les catégories de mods',
        languageDisclaimer: 'Les catégories sont fournies par Thunderstore et ne peuvent pas être traduites.',
        selectors: {
            atLeastOneCategory: 'Les mods doivent contenir au moins une de ces catégories',
            allCategories: 'Les mods doivent contenir toutes ces catégories',
            noneCategories: 'Les mods ne peuvent pas contenir ces catégories'
        },
        allowNsfw: 'Autoriser les mods NSFW (potentiellement explicites)',
        showDeprecated: 'Afficher les mods obsolètes',
        apply: 'Appliquer les filtres'
    },
    sort: {
        title: 'Modifier l\'ordre des mods',
        sortBehaviour: 'Comportement de tri',
        sortDirection: 'Sens du tri',
        close: 'Fermer',
    },
    createProfile: {
        title: 'Créer un profil',
        description: 'Ce profil stockera ses propres mods indépendamment des autres profils.',
        tagStates: {
            required: 'Vous devez entrer un nom de profil',
            valid: '"{profileName}" est un nom de profil valide',
            error: '"{profileName}" est déjà utilisé ou contient des caractères non valides'
        },
        actions: {
            create: 'Créer'
        }
    },
    deleteProfile: {
        title: 'Supprimer un profil',
        content: {
            resultingAction: 'Cela supprimera tous les mods et leurs fichiers de configuration installés dans ce profil.',
            preventAction: 'Si c\'est une erreur, cliquez sur la zone assombrie ou sur la croix en haut à droite.',
            confirmation: 'Êtes-vous sûr de vouloir supprimer ce profil ?'
        },
        actions: {
            delete: 'Supprimer le profil'
        }
    },
    renameProfile: {
        title: 'Renommer un profil',
        content: 'Ce profil stockera ses propres mods indépendamment des autres profils.',
        actions: {
            rename: 'Renommer',
        },
        tagStates: {
            required: 'Vous devez entrer un nom de profil',
            valid: '"{profileName}" est un nom de profil valide',
            error: '"{profileName}" est déjà utilisé ou contient des caractères non valides'
        },
    },
    importProfile: {
        states: {
            fileCodeSelection: {
                title: 'Comment souhaitez-vous importer un profil ?',
                actions: {
                    fromFile: 'Depuis un fichier',
                    fromCode: 'Depuis un code'
                }
            },
            fromFile: {
                title: 'Chargement du fichier',
                content: 'Une fenêtre de sélection de fichier va s\'ouvrir. Une fois le profil sélectionné, cela peut prendre quelques instants.',
            },
            importCode: {
                title: 'Entrez le code du profil',
                enterCodePlaceholder: 'Entrez le code du profil',
                tagStates: {
                    invalid: 'Code invalide, vérifiez qu\'il n\'y a pas de coquilles',
                },
                actions: {
                    loading: 'Chargement',
                    proceed: 'Continuer'
                }
            },
            refresh: {
                title: 'Actualisation de la liste des mods en ligne',
                content: {
                    description: `
                    Certains des paquets dans le profil ne sont pas reconnus par le gestionnaire de mods.
                    L'actualisation de la liste des mods en ligne pourrait résoudre le problème. Veuillez patienter.
                    `,
                    waitingForModDownloads: 'En attente de la fin des téléchargements de mods avant d\'actualiser la liste en ligne',
                }
            },
            reviewImport: {
                title: 'Paquets à installer',
                content: {
                    notFoundDisclaimer: 'Les paquets du profil suivants n\'ont pas été trouvés sur Thunderstore et ne seront pas installés :',
                    ensureCorrectProfile: 'Assurez-vous que le profil est destiné au jeu actuellement sélectionné.',
                    packagesWillBeInstalled: 'Les paquets suivants seront installés :',
                },
                actions: {
                    acknowledgement: 'Je comprends que certains mods ne seront pas importés',
                    proceed: 'Importer'
                }
            },
            willImportOrUpdate: {
                title: 'Souhaitez-vous mettre à jour un profil existant ou en créer un nouveau ?',
                actions: {
                    newProfile: 'Importer un nouveau profil',
                    existingProfile: 'Mettre à jour un profil existant',
                }
            },
            addProfile: {
                title: 'Importer un profil',
                content: {
                    create: {
                        description: 'Ce profil stockera ses propres mods indépendamment des autres profils.'
                    },
                    update: {
                        contentsWillBeOverwritten: 'Tout le contenu du profil sera écrasé par le contenu du code/fichier.',
                        selectProfile: 'Sélectionnez un profil ci-dessous :'
                    }
                },
                tagStates: {
                    required: 'Vous devez entrer un nom de profil',
                    valid: '"{profileName}" est un nom de profil valide',
                    error: '"{profileName}" est déjà utilisé ou contient des caractères non valides'
                },
                actions: {
                    create: 'Créer',
                    update: 'Mettre à jour le profil : {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: 'Téléchargement des mods : {progress} %',
                    downloadingModsWithGoal: 'Téléchargement des mods : {progress} % sur {totalSize}',
                    cleaningUp: 'Nettoyage',
                    applyChanges: 'Application des changements au profil mis à jour',
                    copyingModsToProfile: 'Copie des mods vers le profil : {progress} %',
                    copyingConfigsToProfile: 'Copie des fichiers de configuration vers le profil : {progress} %',
                },
                content: {
                    waitMessage: 'Cela peut prendre un certain temps, car les fichiers sont téléchargés, extraits et copiés.',
                    doNotClose: 'Veuillez ne pas fermer {appName}.'
                }
            }
        }
    },
    platform: {
        header: "Sélectionnez le magasin pour vos jeux",
        selectAction: "Sélectionnez le magasin"
    },
}
