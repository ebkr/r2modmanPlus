import {ProfileSelectionMessageFormat} from "../../base/pages/ProfileSelectionMessageFormat";

export const ProfileSelectionTranslation: ProfileSelectionMessageFormat = {
    pageTitle: {
        title: 'Profils',
        subtitle: 'Les profils aident à organiser facilement les mods'
    },
    actions: {
        backToGameSelection: 'Retour à la sélection du jeu',
        select: 'Sélectionner',
        rename: 'Renommer',
        create: 'Créer un nouveau',
        import: 'Importer / Mettre à jour',
        delete: 'Supprimer'
    },
    error: {
        selectProfile: 'Erreur lors de la sélection du profil',
        updateProfileList: 'Erreur lors de la mise à jour de la liste de profils'
    },
    createProfileModal: {
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
    deleteProfileModal: {
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
    renameProfileModal: {
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
    importProfileModal: {
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
                title: 'Actualisation de la liste de mods en ligne',
                content: {
                    description: `
                    Certains des paquets dans le profil ne sont pas reconnus par le gestionnaire de mods.
                    L'actualisation de la liste de mods en ligne pourrait résoudre le problème. Veuillez patienter.
                    `,
                    waitingForModDownloads: 'En attente de la fin des téléchargements de mods avant d\'actualiser la liste en ligne',
                    refreshStatus: {
                        checkingForUpdates: 'Vérification des mises à jour de la liste des mods depuis Thunderstore',
                        loadingLatestModList: 'Chargement de la dernière liste de mods depuis Thunderstore : {progress}%',
                        pruneCache: 'Élagage des mods qui ne sont plus disponibles dans le cache local',
                        processingModList: 'Traitement de la liste des mods',
                        almostDone: 'Presque terminé',
                        resettingCache: 'Réinitialisation du cache des mods',
                    }
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
                    downloadingMods: 'Téléchargement des mods : {progress}%',
                    cleaningUp: 'Nettoyage',
                    applyChanges: 'Application des changements au profil mis à jour',
                    copyingModsToProfile: 'Copie des mods vers le profil : {progress}%',
                    copyingConfigsToProfile: 'opie des fichiers de configuration vers le profil : {progress}%',
                },
                content: {
                    waitMessage: 'Cela peut prendre un certain temps, car les fichiers sont téléchargés, extraits et copiés.',
                    doNotClose: 'Veuillez ne pas fermer {appName}.'
                }
            }
        }
    }

}
