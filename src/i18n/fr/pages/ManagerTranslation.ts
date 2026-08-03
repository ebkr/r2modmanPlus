import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
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
            gameIconAltText: 'Image du jeu',
            close: 'Fermer',
        },
        activityBar: {
            exportProfile: 'Exporter le profil',
            exportToCode: 'Exporter en code',
            exportToFile: 'Exporter en fichier',
        },
    },
    installed: {
        noModsInstalled: {
            title: 'On dirait que vous n\'avez aucun mod d\'installé',
            content: 'Vous pouvez cliquer sur l\'onglet En ligne à gauche pour parcourir tous les mods disponibles.',
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
                releasedAt: 'Publié le : {formattedDate}',
            },
            concerning: {
                recommendation: 'Il est recommandé de supprimer ce mod.',
            },
            tooltips: {
                updateAvailable: 'Une mise à jour est disponible',
                dependencyIssue: 'Il y a un problème de dépendance avec ce mod',
                disable: 'Désactiver',
                enable: 'Activer',
                donate: 'Faire un don à l\'auteur du mod',
                willNotBeUsed: 'Ce mod ne sera pas utilisé en jeu',
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
                dragToReorder: 'Faire glisser pour réorganiser',
                expand: 'Développer',
                collapse: 'Réduire',
            }
        },
    },
    online: {
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
            packageInformation: 'Informations sur le mod',
            nsfwWarning: 'Ce mod peut contenir du contenu potentiellement explicite',
            fetchingData: 'Récupération des données',
            noDependencies: 'Ce mod n\'a pas de dépendances',
            unableToFetchReadme: 'Impossible de récupérer le README',
            unableToFetchChangelog: 'Impossible de récupérer le CHANGELOG',
        },
        topbar: {
            search: {
                label: 'Rechercher',
                placeholder: 'Rechercher un mod',
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
                nsfw: 'Mod marqué NSFW',
            },
            mod: {
                author: 'par {author}'
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
