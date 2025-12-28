import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Config editor',
        subtitle: 'Select a configuration file to edit'
    },
    warning: {
        content: 'Configuration files are generated after launching the game, with the mod installed, at least once.'
    },
    actions: {
        delete: 'Delete',
        editConfig: 'Edit config',
        openFile: 'Open file',
        search: {
            label: 'Search',
            placeholder: 'Search for a config file',
        },
        sort: {
            label: 'Sort'
        }
    },
    editConfig: {
        actions: {
            cancel: 'Cancel',
            save: 'Save',
            showMore: 'Show more',
            showLess: 'Show less'
        },
        sections: 'Sections',
        subtitle: 'Editing config file'
    }
};
