import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Premiers pas sur {platformName}',
        subtitle: 'Configurons le jeu correctement'
    },
    flatpakWarning: {
        existingArguments: 'On dirait que vous avez déjà défini des arguments de lancement.',
        notice: 'La version Flatpak de {appName} utilise désormais un script wrapper différent.',
        mustUpdate: 'Vous devez mettre à jour vos arguments de lancement pour prendre en charge ce changement.'
    },
    instructions: {
        intro: 'Pour pouvoir lancer {gameName} sur Linux, vous devez d\'abord configurer correctement vos options de lancement Steam.',
        whyNeeded: 'Cette étape est nécessaire en raison du fonctionnement de l\'injection BepInEx sur les systèmes Unix.',
        copyInstruction: 'Veuillez copier-coller ce qui suit dans les options de lancement de {gameName} :'
    },
    actions: {
        copy: 'Copier dans le presse-papiers',
        copied: 'Copié !',
        continue: 'Continuer'
    }
};
