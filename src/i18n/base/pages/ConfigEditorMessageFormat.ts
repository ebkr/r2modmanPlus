export type ConfigEditorMessageFormat = {
    hero: {
        title: string;
        subtitle: string;
    },
    warning: {
        content: string;
    },
    loading: string;
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
        hiddenCount: string;
        selectOption: string;
        actions: {
            save: string;
            cancel: string;
            showMore: string;
            showLess: string;
        }
    }
}
