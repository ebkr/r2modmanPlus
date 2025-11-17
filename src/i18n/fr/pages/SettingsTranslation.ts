import {SettingsMessageFormat} from "src/i18n/base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    title: {
        subtitle: 'Options avancées pour {appName} : {version}',
    },
    actions: {
        search: {
            text: 'Recherche:',
            placeholder: 'Rechercher un paramètre',
        }
    },
    groups: {
        all: 'Tous',
        profile: 'Profil',
        locations: 'Emplacements',
        debugging: 'Débogage',
        other: 'Autres',
        modpacks: 'Packs de mods',
    },
    locations: {
        browseDataFolder: {
            title: 'Parcourir le dossier de données',
            description: 'Ouvrir le dossier où les mods sont stockés pour tous les jeux et profils.',
        },
        changeGameFolder: {
            title: 'Modifier l\'emplacement du dossier de {gameName}',
            description: 'Modifier l\'emplacement du dossier de {gameName} utilisé par {appName}.',
            setManually: 'Vous devez localiser le dossier du jeu manuellement en cliquant ici'
        },
        browseProfileFolder: {
            title: 'Parcourir le dossier du profil',
            description: 'Ouvrir le dossier où les mods sont stockés pour le profil actuel.',
        },
        changeDataFolder: {
            title: 'Modifier le dossier de données',
            description: 'Modifier le dossier où les mods sont stockés pour tous les jeux et profils. Le dossier ne sera pas supprimé et les profils existants ne seront pas transférés.',
        },
        changeSteamFolder: {
            title: `Modifier le dossier {''}@:translations.platforms.STEAM{''}`,
            description: `Modifier l'emplacement du dossier @:translations.platforms.STEAM utilisé par {appName}.`,
            states: {
                setManually: 'Vous devez cliquer sur ce paramètre et localiser le dossier manuellement'
            }
        }
    },
    debugging: {
        copyLogFile: {
            title: 'Copier le contenu du fichier journal dans le presse-papiers',
            description: 'Copier le texte du fichier LogOutput.log dans le presse-papiers, avec un formatage Discord.',
            logFileExists: 'Le fichier journal existe',
            logFileDoesNotExist: 'Le fichier journal n\'existe pas',
        },
        copyTroubleshootingInfo: {
            title: 'Copier les informations de dépannage dans le presse-papiers',
            description: 'Copier les paramètres et autres informations dans le presse-papiers, avec un formatage Discord.',
            value: 'Partagez ces informations lorsque vous demandez de l\'aide sur Discord.',
        },
        toggleDownloadCache: {
            title: 'Basculer le cache de téléchargement',
            description: 'Le téléchargement d\'un mod ignorera les mods stockés dans le cache. Les mods seront toujours placés dans le cache.',
            enabled: 'Cache activé (recommandé)',
            disabled: 'Cache désactivé',
        },
        setLaunchArguments: {
            title: 'Définir les arguments de lancement',
            description: 'Fournir des arguments personnalisés utilisés pour démarrer le jeu.',
            value: 'Ces commandes sont utilisées avec l\'exécutable Steam au démarrage du jeu'
        },
        cleanModCache: {
            title: 'Nettoyer le cache des mods',
            description: 'Libérer de l\'espace supplémentaire causé par les mods mis en cache qui ne sont pas actuellement dans un profil.',
            value: 'Vérifier tous les profils pour les mods inutilisés et vider le cache',
        },
        cleanOnlineModList: {
            title: 'Nettoyer la liste des mods en ligne',
            description: 'Supprime la copie locale de la liste de mods, forçant la prochaine actualisation à en récupérer une nouvelle.',
            states: {
                updating: 'La liste des mods en ligne est en cours de mise à jour, veuillez attendre que l\'opération soit terminée',
                hasCopy: '{gameName} a une copie locale de la liste de mods en ligne',
                doesNotHaveCopy: '{gameName} n\'a aucune copie locale stockée',
                errorOccurred: 'Une erreur est survenue lors de la vérification du statut de la liste des mods',
                unknown: 'Statut inconnu'
            }
        },
        toggleThunderstoreCdn: {
            title: 'Activer / désactiver le CDN Thunderstore préféré',
            description: 'Changer le CDN jusqu\'au redémarrage de l\'application. Cela pourrait contourner les problèmes de téléchargement des mods.',
            current: 'Actuel : {label} ({url})'
        },
        resetGameInstallation: {
            title: 'Réinitialiser l\'installation de {gameName}',
            description: 'Résoudre les problèmes causés par des fichiers corrompus ou des fichiers restants des tentatives de modding manuel.',
            value: `Cela supprimera tout le contenu du dossier "{folderName}" et vérifiera les fichiers en utilisant @:translations.platforms.STEAM`
        },
        changeLaunchBehaviour: {
            title: 'Modifier le comportement de lancement',
            description: 'Sélectionner un comportement de lancement spécifique, comme forcer Steam à se lancer avec Proton',
            value: `Le comportement de lancement actuel est défini sur : @:translations.enums.launchType.{launchType}`
        }
    },
    profile: {
        changeProfile: {
            title: 'Changer de profil',
            description: 'Changer le profil de mods.',
            value: 'Profil actuel : {profileName}',
        },
        enableAllMods: {
            title: 'Activer tous les mods',
            description: 'Activer tous les mods pour le profil actuel.',
            value: `
            Aucun mod n'est actuellement activé. Vous avez {totalModCount} mods |
            1 mod est activé sur {totalModCount} |
            {enabledModCount} mods sont activés sur {totalModCount}
            `
        },
        disableAllMods: {
            title: 'Désactiver tous les mods',
            description: 'Désactiver tous les mods pour le profil actuel.',
            value: `
            Aucun mod n'est actuellement désactivé. Vous avez {totalModCount} mods |
            1 mod est désactivé sur {totalModCount} |
            {disabledModCount} mods sont désactivés sur {totalModCount}
            `,
        },
        importLocalMod: {
            title: 'Importer un mod local',
            description: `Installer un mod qui n'a pas été téléchargé depuis l'onglet "{''}@:translations.pages.manager.navigation.modsActions.online{''}".`,
            value: 'Le gestionnaire tentera d\'installer les mods correctement. Il n\'est pas garanti que l\'installation se déroule comme prévu.'
        },
        exportProfileAsFile: {
            title: 'Exporter le profil en tant que fichier',
            description: 'Exporter votre liste de mods et vos configurations en tant que fichier.',
            value: 'Le fichier exporté peut être partagé avec des amis pour obtenir un profil identique rapidement et facilement',
        },
        exportProfileAsCode: {
            title: 'Exporter le profil en tant que code',
            description: 'Exporter votre liste de mods et vos configurations sous forme de code.',
            value: 'Le code exporté peut être partagé avec des amis pour obtenir un profil identique rapidement et facilement',
        },
        updateAllMods: {
            title: 'Mettre à jour tous les mods',
            description: 'Mettre rapidement à jour tous les mods installés vers leurs dernières versions.',
            value: `
            Aucun mod n'est disponible pour la mise à jour |
            Vous avez 1 mod disponible pour la mise à jour |
            Vous avez {count} mods disponibles pour la mise à jour
            `,
        }
    },
    other: {
        toggleFunkyMode: {
            title: 'Activer / désactiver le mode funky',
            description: 'Activer / désactiver le mode funky.',
            states: {
                enabled: 'Le mode funky est activé',
                disabled: 'Le mode funky est désactivé',
            },
        },
        switchTheme: {
            title: 'Changer de thème',
            description: 'Basculer entre les thèmes clair et sombre.',
            themes: {
                light: 'Actuel : Thème clair (par défaut)',
                dark: 'Actuel : Thème sombre',
            },
        },
        switchCardDisplayType: {
            title: 'Changer le type d\'affichage des cartes',
            description: 'Basculer entre les cartes agrandies ou réduites.',
            states: {
                expanded: 'Actuel : Agrandies',
                collapsed: 'Actuel : Réduites (par défaut)'
            }
        },
        refreshOnlineModList: {
            title: 'Actualiser la liste des mods en ligne',
            description: 'Vérifier les nouvelles versions de mods.',
            states: {
                refreshing: 'Actualisation en cours',
                errorRefreshing: 'Un problème est survenu lors de l\'actualisation de la liste des mods : {errorText}',
                disabledWhilstDownloading: 'L\'actualisation de la liste des mods est désactivée tant qu\'il y a des téléchargements actifs',
                cacheDate: 'Date du cache : {formattedDate}',
                apiUnavailable: 'Aucune information API disponible',
            }
        },
        changeGame: {
            title: 'Changer de jeu',
            description: 'Changer le jeu actuel.',
        }
    },
    modpacks: {
        showDependencyStrings: {
            title: 'Afficher les chaînes de dépendance',
            description: 'Afficher une liste des mods installés avec leurs chaînes de version. Utilisé dans le tableau de dépendances à l\'intérieur du fichier manifest.json.',
            value: `
            Aucune chaîne de dépendance car il n'y a pas de mods installés. |
            Afficher la chaîne de dépendance pour 1 mod |
            Afficher les chaînes de dépendance pour {n} mods
            `
        }
    }
};
