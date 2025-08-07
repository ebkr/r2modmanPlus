export type ProfileSelectionMessageFormat = {
    pageTitle: {
        title: string;
        subtitle: string;
    },
    actions: {
        backToGameSelection: string;
        select: string;
        rename: string;
        create: string;
        import: string;
        delete: string;
    },
    error: {
        selectProfile: string;
        updateProfileList: string;
    },
    createProfileModal: {
        title: string;
        description: string;
        tagStates: {
            required: string;
            valid: string;
            error: string;
        },
        actions: {
            create: string;
        }
    },
    deleteProfileModal: {
        title: string;
        content: {
            resultingAction: string;
            preventAction: string;
            confirmation: string;
        },
        actions: {
            delete: string;
        }
    },
    renameProfileModal: {
        title: string;
        content: string;
        actions: {
            rename: string;
        },
        tagStates: {
            required: string;
            valid: string;
            error: string;
        },
    },
    importProfileModal: {
        states: {
            fileCodeSelection: {
                title: string;
                actions: {
                    fromCode: string;
                    fromFile: string;
                }
            },
            importCode: {
                title: string;
                enterCodePlaceholder: string;
                actions: {
                    proceed: string;
                    loading: string;
                },
                tagStates: {
                    invalid: string;
                }
            },
            fromFile: {
                title: string;
                content: string;
            },
            refresh: {
                title: string;
                content: {
                    description: string;
                    waitingForModDownloads: string;
                    refreshStatus: {
                        checkingForUpdates: string;
                        loadingLatestModList: string;
                        pruneCache: string;
                        processingModList: string;
                        almostDone: string;
                        resettingCache: string;
                    };
                };
            },
            reviewImport: {
                title: string;
                content: {
                    notFoundDisclaimer: string;
                    ensureCorrectProfile: string;
                    packagesWillBeInstalled: string;
                },
                actions: {
                    acknowledgement: string;
                    proceed: string;
                }
            },
            willImportOrUpdate: {
                title: string;
                actions: {
                    newProfile: string;
                    existingProfile: string;
                }
            },
            addProfile: {
                title: string;
                content: {
                    create: {
                        description: string;
                    },
                    update: {
                        contentsWillBeOverwritten: string;
                        selectProfile: string;
                    }
                };
                tagStates: {
                    required: string;
                    valid: string;
                    error: string;
                },
                actions: {
                    create: string;
                    update: string;
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: string;
                    cleaningUp: string;
                    applyChanges: string,
                    copyingModsToProfile: string;
                    copyingConfigsToProfile: string;
                },
                content: {
                    waitMessage: string;
                    doNotClose: string;
                }
            }
        }
    }
}
