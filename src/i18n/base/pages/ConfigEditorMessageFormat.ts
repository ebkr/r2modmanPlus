export type ConfigEditorMessageFormat = {
    hero: {
        title: string;
        subtitle: string;
    },
    warning: {
        content: string;
    },
    actions: {
        editConfig: string;
        openFile: string;
        delete: string;
        search: {
            label: string;
            placeholder: string;
        };
        sort: {
            label: string;
        }
    },
    editConfig: {
        subtitle: string;
        sections: string;
        actions: {
            save: string;
            cancel: string;
            showMore: string;
            showLess: string;
        }
    }
}
