import { ConfigEditorMessageFormat } from '../../base/pages/ConfigEditorMessageFormat';

export const ConfigEditorTranslation: ConfigEditorMessageFormat = {
    hero: {
        title: 'Config editor',
        subtitle: 'Select a configuration file to edit'
    },
    warning: {
        content: 'Configuration files are generated after launching the game, with the mod installed, at least once.'
    },
    loading: 'Looking for config files',
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
        hiddenCount: '(1 hidden) | ({count} hidden)',
        selectOption: 'Select an option',
        subtitle: 'Editing config file'
    }
};
