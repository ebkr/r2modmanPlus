const message = {
    metadata: {
        name: 'French',
        locale: 'fr'
    },
    translations: {
        pages: {
            gameSelection: {
                platformModal: {
                    header: "Sélectionnez le magasin pour vos jeux",
                    selectAction: "Sélectionnez le magasin"
                },
                pageTitle: {
                    title: {
                        game: 'Sélectionnez un jeu',
                        server: 'Sélectionnez un serveur'
                    },
                    subtitle: {
                        game: 'Sélectionnez un jeu pour gérer vos mods',
                        server: 'Sélectionnez un serveur pour gérer vos mods'
                    }
                },
                migrationNotice: {
                    requiresUpdate: 'Une mise à jour du gestionnaire a eu lieu et un travail de fond est nécessaire.',
                    actionsDisabled: 'Les actions de sélection de jeu sont désactivées jusqu\'à ce que le travail soit terminé.'
                },
                tabs: {
                    game: 'Jeu',
                    server: 'Serveur'
                },
                actions: {
                    select: {
                        game: 'Sélectionner',
                        server: 'Sélectionner'
                    },
                    setAsDefault: 'Définir par défaut'
                },
                filter: {
                    placeholder: {
                        game: 'Rechercher un jeu',
                        server: 'Rechercher un serveur'
                    }
                }
            },
            splash: {
                pageTitle: 'Démarrage de {appName}',
                gameUpdatesWarning: 'Les mises à jour du jeu peuvent endommager les mods. Si une nouvelle mise à jour est disponible, merci de patienter.',
                menu: {
                    helpLabel: 'Aide',
                    helpItems: {
                        about: 'À propos',
                        faq: 'FAQ'
                    }
                },
                actions: {
                    goBack: 'Retour'
                },
                content: {
                    main: {
                        didYouKnow: 'Saviez-vous ?',
                        externalInstallWithModManager: `
                        Vous pouvez utiliser le bouton « Install with Mod Manager » sur Thunderstore pour installer des mods à l'aide de {appName}.
                        `,
                        goToThunderstore: 'Aller à Thunderstore',
                        exportProfile: "Tu peux exporter le profil que tu as sélectionné depuis les paramètres d'écran, soit sous forme de fichier, soit en tant que code. Comme ça, c'est facile de partager ta liste de mods avec tes potes !",
                        havingTrouble: {
                            title: 'Besoin d\'aide ?',
                            body: 'Envoie une capture d\'écran de l\'erreur sur le canal d\'assistance du serveur Discord de {appName}.',
                            serverLinkText: 'Rejoignez le serveur Discord {appName}'
                        }
                    },
                    about: {
                        title: 'À propos de {appName}',
                        creator: "L'application a été créée par Ebkr.",
                        techStack: {
                            builtUsing: "L'application a été conçue avec Quasar, qui fournit la stack technologique suivante :",
                            electron: 'Electron',
                            node: 'NodeJS',
                            vue: 'Vue 3',
                            typescript: 'TypeScript'
                        }
                    },
                    faq: {
                        title: 'FAQ',
                        howToGetStarted: {
                            title: 'Comment démarrer ?',
                            body: "Rendez-vous dans l'onglet En ligne et téléchargez vos mods préférés. Cliquez sur « Démarrer moddé » et profitez-en."
                        },
                        startingWithMods: {
                            title: 'Démarrer le jeu avec des mods',
                            body: `
                            Vous devez lancer le jeu depuis l'application.
                            Le démarrer via Steam ne fonctionnera pas sans modifications manuelles.
                            `
                        }
                    }
                },
                states: {
                    preparing: 'Préparation',
                    checkingForUpdates: 'Vérification des mises à jour',
                    checkingForLocalCache: 'Vérification de la liste des mods dans le cache local',
                    checkingForThunderstoreUpdates: 'Vérification des mises à jour de la liste des mods depuis Thunderstore',
                    loadingLatestThunderstoreList: 'Chargement de la dernière liste de mods depuis Thunderstore',
                    pruningLocalCache: 'Élagage des mods qui ne sont plus disponibles dans le cache local',
                    processingModList: 'Traitement de la liste des mods'
                }
            },
            platforms: {
                STEAM: 'Steam',
                STEAM_DIRECT: 'Steam',
                EPIC_GAMES_STORE: 'Epic Games Store',
                OCULUS_STORE: 'Oculus / Meta Magasin',
                ORIGIN: 'Origin / EA App',
                XBOX_GAME_PASS: 'Xbox Game Pass',
                OTHER: 'Autre'
            }
        }
    }
};

// Exported separately to enforce validation on exported type
export default message;
