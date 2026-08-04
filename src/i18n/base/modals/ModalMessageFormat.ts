export type ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: string;
        steamExecutableNotSelected: string;
        solution: string;
    },
    failedToSetTheGameFolder: {
        title: string;
        listedExecutableNames: string;
        executableMustBeOneOf: string;
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
    },
    importLocalMod: {
        title: string;
        dialogTitle: string;
        actions: {
            selectFile: string;
            importLocalMod: string;
        }
        content: {
            waitingForSelection: string;
            instructToSelect: string;
            dataEntryInfo: string;
            form: {
                modName: {
                    label: string;
                    placeholder: string;
                },
                modAuthor: {
                    label: string;
                    placeholder: string;
                },
                description: {
                    label: string;
                    placeholder: string;
                },
                version: {
                    label: string;
                    majorLabel: string;
                    minorLabel: string;
                    patchLabel: string;
                }
            }
        },
        validationMessages: {
            modNameEmpty: string;
            authorNameEmpty: string;
            nonNumericVersion: string;
            invalidVersion: string;
            noProfileSelected: string;
        },
    },
    concerningPackage: {
        title: string;
        notFound: string;
        whyRemoved: string;
        recommendation: string;
        exportWarning: string;
        actions: {
            markSafe: string;
            remove: string;
            review: string;
        }
    },
    gameRunning: {
        starting: string;
        launchingViaSteam: string;
        closeToContinue: string;
        takingAWhile: string;
        bePatient: string;
        close: string;
    },
    error: {
        title: string;
        suggestion: string;
        close: string;
    },
    disableMod: {
        title: string;
        dependantsWarning: string;
        modsToBeDisabled: string;
        actions: {
            disableAll: string;
            disableAllRecommended: string;
            disableOnly: string;
        }
    },
    uninstallMod: {
        title: string;
        dependantsWarning: string;
        modsToBeUninstalled: string;
        actions: {
            uninstallAll: string;
            uninstallAllRecommended: string;
            uninstallOnly: string;
        }
    },
    associatedMods: {
        title: string;
        dependencies: string;
        dependants: string;
        none: string;
        done: string;
    },
    codeExport: {
        title: string;
        description: string;
        done: string;
        copied: string;
    },
    downloadProgress: {
        states: {
            downloading: string;
            installing: string;
        },
        complete: string;
        close: string;
        downloadProgress: string;
        installProgress: string;
        waitingForDownload: string;
        extractionProgress: string;
    },
    downloadModVersionSelect: {
        title: string;
        content: {
            recommendedDisclaimer: string;
            outdatedModsAdvice: string;
        }
        tags: {
            select: string;
            recommended: string;
            latest: string;
            outdated: string;
        }
        download: string;
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: string;
            content: string;
            close: string;
        },
        hasModsToUpdate: {
            title: string;
            content: {
                willBeUpdated: string;
                missingDependenciesInstalled: string;
                whatWillHappen: string;
                modUpdatedTo: string;
            },
            updateAll: string;
        }
    },
    launchType: {
        title: string;
        auto: {
            NATIVE: string;
            PROTON: string;
        },
        native: {
            unsureWrapperArgsPresent: string;
            addArgumentsInfo: string;
        },
        actions: {
            copyLaunchArgs: string;
            update: string;
        }
    },
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
    },
    sort: {
        title: string;
        sortBehaviour: string;
        sortDirection: string;
        close: string;
    },
    createProfile: {
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
    deleteProfile: {
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
    renameProfile: {
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
    importProfile: {
        dialogTitle: string;
        dialogButton: string;
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
                    downloadingModsWithGoal: string;
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
    },
    platform: {
        header: string;
        selectAction: string;
    },
    settingsLoader: {
        managerProblem: string;
        loadFailed: string;
        resetAction: string;
        resetFailed: string;
        instructionsLinkText: string;
        resetDidNotHelp: string;
    },
    actions: {
        close: string;
    },
}
