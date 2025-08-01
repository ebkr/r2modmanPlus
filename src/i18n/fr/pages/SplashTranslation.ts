import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
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
}
