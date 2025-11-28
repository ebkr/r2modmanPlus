import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Éditeur de configuration',
        subtitle: 'Sélectionner un fichier de configuration à modifier'
    },
    warning: {
        content: 'Les fichiers de configuration sont générés après avoir lancé le jeu, avec le mod installé, au moins une fois.'
    },
    actions: {
        delete: 'Supprimer',
        editConfig: 'Modifier la configuration',
        openFile: 'Ouvrir le fichier',
        search: {
            label: 'Recherche',
            placeholder: 'Rechercher un fichier de configuration',
        },
        sort: {
            label: 'Trier'
        }
    },
    editConfig: {
        actions: {
            cancel: 'Annuler',
            save: 'Enregistrer',
            showMore: 'Afficher plus',
            showLess: 'Afficher moins'
        },
        sections: 'Sections',
        subtitle: 'Modification du fichier de configuration'
    }
};
