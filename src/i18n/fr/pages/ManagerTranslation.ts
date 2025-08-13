import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    updateAvailable: {
        title: 'Une mise à jour est disponible.',
        linkText: 'Cliquez ici pour accéder à la page de la version.',
    },
    navigation: {
        gameActions: {
            startModded: 'Démarrer moddé',
            startVanilla: 'Démarrer de base'
        },
        modsActions: {
            label: 'Mods',
            installed: 'Installés',
            online: 'En ligne'
        },
        otherActions: {
            label: 'Autres',
            configEditor: 'Éditeur de config',
            settings: 'Paramètres',
            help: 'Aide',
        },
        profileSwitcher: {
            label: 'Profil',
            gameIconAltText: 'Image du jeu'
        },
    },
    installed: {
        noModsInstalled: {
            title: 'On dirait que vous n\'avez aucun mod d\'installé',
            content: 'Vous pouvez cliquer sur l\'onglet En ligne à gauche pour parcourir tous les mods disponibles.',
        },
        updatableModsBanner: {
            text: `
            Vous avez {numberOfModsWithUpdates} mod avec une mise à jour disponible. |
            Vous avez {numberOfModsWithUpdates} mods avec des mises à jour disponibles.
            `,
            updateAction: 'Tout mettre à jour ?'
        },
        searchAndSort: {
            search: {
                label: 'Rechercher',
                placeholder: 'Rechercher un mod installé',
            },
            sort: {
                label: 'Trier',
                disabledPositions: {
                    label: 'Désactivés',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: 'Obsolète',
                disabled: 'Désactivé'
            },
            display: {
                byline: 'v{version} par {author}',
                installedAt: 'Installé le : {formattedDate}',
            },
            tooltips: {
                updateAvailable: 'Une mise à jour est disponible',
                dependencyIssue: 'Il y a un problème de dépendance avec ce mod',
                disable: 'Désactiver',
                enable: 'Activer',
                donate: 'Faire un don à l\'auteur du mod',
            },
            actions: {
                uninstall: 'Désinstaller',
                disable: 'Désactiver',
                enable: 'Activer',
                associated: 'Associé',
                openWebsite: 'Site web',
                update: 'Mettre à jour',
                downloadDependency: 'Télécharger la dépendance',
                enableSpecific: 'Activer {dependencyName}',
                donate: 'Faire un don',
            }
        },
        expandableCard: {
            imageAltText: 'Image du mod',
            funkyModeAltText: 'Superposition du mode funky',
            tooltips: {
                dragToReorder: 'Faire glisser pour réorganise',
                expand: 'Développer',
                collapse: 'Réduire',
            }
        },
    },
    modals: {
        failedToSetSteamFolder: {
            title: 'Échec de la configuration du dossier Steam',
            steamExecutableNotSelected: 'L\'exécutable Steam n\'a pas été sélectionné.',
            solution: 'Si cette erreur apparaît alors que l\'exécutable est correct, veuillez exécuter en tant qu\'administrateur.'
        },
        failedToSetTheGameFolder: {
            title: 'Échec du changement de dossier {gameName}',
            listedExecutableNames: 'L\'exécutable doit être l\'un des suivants : "{options}".',
            solution: 'Si cette erreur apparaît alors que l\'exécutable est correct, veuillez exécuter en tant qu\'administrateur.'
        },
        clearingGameDirectory: {
            title: 'Nettoyage du répertoire d\'installation de {gameName}',
            waitToLaunchGame: 'Vous ne pourrez pas lancer le jeu tant que Steam n\'aura pas vérifié l\'intégrité des fichiers du jeu.',
            steamWillBeStarted: 'Steam va démarrer et tenter de vérifier l\'intégrité de {gameName}.',
            checkSteamForProgress: `
            Veuillez vérifier la fenêtre de Steam pour l'avancement de la validation.
            Si la fenêtre n'est pas encore apparue, veuillez patienter.
            `,
            confirmation: 'Je comprends'
        },
        dependencyStrings: {
            title: 'Liste des identifiants de dépendance',
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
            downloadProgress: 'Téléchargement : {progress}% terminé',
            installProgress: 'Installation : {progress}% terminée',
            waitingForDownload: 'Installation : en attente de la fin du téléchargement',
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
        }
    },
    online: {
        modals: {
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
                close: 'Fermer'
            },
        },
        previewPanel: {
            author: 'Par {author}',
            metadata: {
                downloads: 'Téléchargements : {downloads}',
                likes: 'Appréciations : {likes}',
                lastUpdated: 'Dernière mise à jour : {date}',
                categories: 'Catégories : {categories}',
            },
            actions: {
                download: 'Télécharger',
                viewOnline: 'Voir en ligne',
                donate: 'Faire un don',
            },
            tabs: {
                readme: 'README',
                changelog: 'CHANGELOG',
                dependencies: 'Dépendances ({dependencyCount})',
            },
            fetchingData: 'Récupération des données',
            noDependencies: 'Ce mod n\'a pas de dépendances',
            unableToFetchReadme: 'Impossible de récupérer le README',
            unableToFetchChangelog: 'Impossible de récupérer le CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Rechercher',
                placeholder: 'Rechercher',
            },
            sort: 'Trier',
            filter: 'Filtrer',
        },
        pagination: {
            changePageInfo: 'Utilisez les nombres ci-dessous pour changer de page',
            noFoundMods: 'Aucun mod correspondant à la recherche trouvé',
            noMods: 'Aucun mod disponible',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: 'Épinglé',
                    long: 'Épinglé sur Thunderstore'
                },
                deprecated: {
                    short: 'Obsolète',
                    long: 'Ce mod est potentiellement cassé'
                },
                donate: 'Faire un don à l\'auteur du mod',
                installed: 'Mod déjà installé',
            },
            mod: {
                author: 'Par {author}'
            },
            actions: {
                download: 'Télécharger',
                website: 'Site web',
            }
        }
    },
    actions: {
        locateGameExecutable: "Localiser l'exécutable de {gameName}",
        selectExecutable: "Sélectionner l'exécutable",
        locateGameLaunchHelper: "Localiser l'exécutable de gamelaunchhelper",
        locateSteamExecutable: "Localiser l'exécutable de Steam"
    }
}
