export type ManagerMessageFormat = {
    updateAvailable: {
        title: string;
        linkText: string;
    },
    navigation: {
        gameActions: {
            startModded: string;
            startVanilla: string;
        },
        modsActions: {
            label: string;
            installed: string;
            online: string;
        },
        otherActions: {
            label: string;
            configEditor: string;
            settings: string;
            help: string;
        },
        profileSwitcher: {
            label: string;
            gameIconAltText: string;
        }
    },
    installed: {
        noModsInstalled: {
            title: string;
            content: string;
        },
        updatableModsBanner: {
            text: string;
            updateAction: string;
        },
        searchAndSort: {
            search: {
                label: string;
                placeholder: string;
            },
            sort: {
                label: string;
                order: {
                    options: {
                        CUSTOM: string;
                        MOD_NAME: string;
                        AUTHOR: string;
                        INSTALL_DATE: string;
                    }
                },
                directions: {
                    options: {
                        STANDARD: string;
                        REVERSE: string;
                    }
                },
                disabledPositions: {
                    label: string;
                    options: {
                        NONE: string;
                        CUSTOM: string;
                        FIRST: string;
                        LAST: string;
                    }
                },

            }
        }
    }
}
