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
        },
        localModCard: {
            labels: {
                deprecated: string;
                disabled: string;
            },
            display: {
                byline: string;
                installedAt: string;
            },
            tooltips: {
                updateAvailable: string;
                dependencyIssue: string;
                disable: string;
                enable: string;
                donate: string;
            },
            actions: {
                uninstall: string;
                disable: string;
                enable: string;
                associated: string;
                openWebsite: string;
                update: string;
                downloadDependency: string;
                enableSpecific: string
                donate: string;
            }
        },
        expandableCard: {
            imageAltText: string;
            funkyModeAltText: string;
            tooltips: {
                dragToReorder: string;
                expand: string;
                collapse: string;
            }
        },
    },
    modals: {
        failedToSetSteamFolder: {
            title: string;
            steamExecutableNotSelected: string;
            solution: string;
        },
        failedToSetTheGameFolder: {
            title: string;
            listedExecutableNames: string;
            solution: string;
        },
        clearingGameDirectory: {
            title: string;
            waitToLaunchGame: string;
            steamWillBeStarted: string;
            checkSteamForProgress: string;
            confirmation: string;
        },
        dependencyStrings: {
            title: string;
            dependency: string;
            close: string;
        },
        launchArguments: {
            title: string;
            someProvidedByDefault: string;
            moddedLabel: string;
            availableAfterInstallingLoader: string;
            vanillaLabel: string;
            pleaseNote: string;
            placeholder: string;
            updateArguments: string;
        },
        categorySelector: {
            selectCategory: string;
            noCategoriesSelected: string;
        }
    },
    online: {
        modals: {
            modFilter: {
                title: string;
                languageDisclaimer: string;
                selectors: {
                    atLeastOneCategory: string;
                    allCategories: string;
                    noneCategories: string;
                },
                allowNsfw: string;
                showDeprecated: string;
                apply: string;
            }
        }
    }
}
