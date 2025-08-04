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
        action: {
            delete: 'Supprimer le profil'
        }
    },
    renameProfileModal: {
    },
    importProfileModal: {
    }
}
