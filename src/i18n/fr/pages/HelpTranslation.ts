import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    tabs: {
        general: 'Général',
        gameWontStart: 'Le jeu ne démarre pas',
        modsNotShowing: 'Les mods n\'apparaissent pas',
        updating: 'Mises à jour',
    },
    general: {
        gettingStarted: {
            title: 'Commencez par installer des mods',
            whereToFindMods: `
            Rendez-vous dans l'onglet "En ligne", trouvez un mod et cliquez sur télécharger.
            Il téléchargera également les dépendances, ce qui vous fera gagner du temps.
            `,
            onceInstalled: 'Une fois que vous avez installé les mods que vous souhaitez utiliser, cliquez simplement sur {startModdedAction} en haut à gauche.',
        },
        slowGame: {
            title: 'Jeu lent avec des mods / saccades ?',
            likelyCause: `
            Cela est probablement dû à un mod qui génère des erreurs.
            Une solution consiste à désactiver la moitié de vos mods et à vérifier si le problème persiste.
            `,
            issuePersisting: `
            Si le problème persiste, désactivez une autre moitié.
            Continuez ainsi jusqu'à ce que le problème soit résolu.
            `,
            ifStutters: 'En cas de saccades, il peut y avoir des mods d\'optimisation qui peuvent vous aider.',
        },
        dedicatedServers: {
            title: 'Serveurs dédiés',
            content: `
            Les serveurs dédiés ne sont pas directement pris en charge par le gestionnaire.
            Cependant, une solution consiste à copier le contenu de votre dossier de profil dans votre dossier de serveur dédié.
            `,
        },
        launchingExternally: {
            title: 'Lancer le jeu depuis l\'extérieur du gestionnaire de mods',
            howTo: 'Par conception, votre expérience en démarrant le jeu via Steam sera vanilla (non-moddée / base).',
            whereToPlace: 'Vous devrez placer l\'argument correspondant dans l\'emplacement des paramètres de lancement pertinents de votre plateforme.',
            forSteam: 'Pour Steam, cela se trouve dans les propriétés du jeu.',
            yourCurrentArgument: 'Votre argument actuel serait :',
            loaderNotInstalled: 'Ces paramètres seront disponibles une fois qu\'un chargeur de mods aura été installé.',
            copyArguments: 'Copier les arguments',
        },
    },
    gameWontStart: {
        errorModal: {
            title: 'Une boîte rouge apparaît lorsque j\'essaie de démarrer le jeu',
            solution: 'Il y a généralement une suggestion au bas de la boîte rouge. Cela peut résoudre le problème.',
        },
        redirectedToStorePage: {
            title: 'Je suis redirigé vers la page du magasin Steam',
            solution: 'Vous devez posséder une copie légale du jeu pour utiliser {appName}. Vous pouvez l\'acheter depuis la page du magasin.',
        },
        consoleCloses: {
            title: 'Une fenêtre de texte apparaît et se ferme immédiatement',
            tryRunning: 'Essayez d\'exécuter "Réinitialiser l\'installation de {gameName}" dans l\'écran Paramètres.',
            ifPersists: 'Si cela persiste, forcez la fermeture de Steam et démarrez le jeu moddé avec Steam fermé.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: 'Solutions potentielles',
            instructToWiki: 'Les problèmes les plus courants sont résolus en suivant les instructions listées sur le wiki.',
            goToWiki: 'Aller au wiki',
        }
    },
    updating: {
        autoUpdates: {
            title: 'Mises à jour automatiques',
            whenDoesItUpdate: 'Le gestionnaire se met à jour automatiquement à la fermeture si une mise à jour est disponible.',
            downloadedInBackground: 'Les mises à jour sont téléchargées en arrière-plan.',
            promptToRunOldInstaller: 'Il se peut que vous receviez une invite pour exécuter "{oldInstaller}" en tant qu\'administrateur. Il s\'agit du programme de mise à jour.',
            ifProblemOccurs: 'Si un problème survient lors d\'une mise à jour, téléchargez et exécutez le dernier programme d\'installation.',
        },
        ignoreUpdates: {
            title: 'Je ne veux pas de mises à jour',
            content: 'Sur GitHub, il existe une version portable qui ne se met pas à jour automatiquement. Vous êtes cependant averti qu\'une mise à jour est disponible.'
        }
    }
}
