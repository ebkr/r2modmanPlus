import {EnumMessageFormat} from "../../base/enums/EnumMessageFormat";

export const EnumTranslation: EnumMessageFormat = {
    sortNaming: {
        CUSTOM: 'Personnalisé',
        MOD_NAME: 'Nom du mod',
        AUTHOR: 'Nom de l\'auteur',
        INSTALL_DATE: 'Date d\'installation',
    },
    sortDirection: {
        STANDARD: 'Standard',
        REVERSE: 'Inversé',
    },
    sortLocalDisabledMods: {
        NONE: 'Aucun',
        CUSTOM: 'Personnalisé',
        FIRST: 'En premier',
        LAST: 'En dernier',
    },
    sortingStyle: {
        DEFAULT: 'Par défaut',
        LAST_UPDATED: 'Dernière mise à jour',
        ALPHABETICAL: 'Alphabétique',
        DOWNLOADS: 'Nombre de téléchargements',
        RATING: 'Évaluation',
    },
    launchType: {
        AUTO: 'Auto',
        NATIVE: 'Natif',
        PROTON: 'Proton',
    }
}
