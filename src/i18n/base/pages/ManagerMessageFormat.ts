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
            close: string;
        },
        activityBar: {
            exportProfile: string;
            exportToCode: string;
            exportToFile: string;
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
                disabledPositions: {
                    label: string;
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
                releasedAt: string;
            },
            concerning: {
                recommendation: string;
            },
            tooltips: {
                updateAvailable: string;
                dependencyIssue: string;
                disable: string;
                enable: string;
                donate: string;
                willNotBeUsed: string;
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
            },
            sort: {
                title: string;
                sortBehaviour: string;
                sortDirection: string;
                close: string;
            },
        },
        previewPanel: {
            author: string;
            metadata: {
                downloads: string;
                likes: string;
                lastUpdated: string;
                categories: string;
            },
            actions: {
                download: string;
                viewOnline: string;
                donate: string;
            },
            tabs: {
                readme: string;
                changelog: string;
                dependencies: string;
            },
            packageInformation: string;
            nsfwWarning: string;
            fetchingData: string;
            noDependencies: string;
            unableToFetchReadme: string;
            unableToFetchChangelog: string;
        },
        topbar: {
            search: {
                label: string;
                placeholder: string;
            },
            sort: string;
            filter: string;
        },
        pagination: {
            changePageInfo: string;
            noFoundMods: string;
            noMods: string;
        },
        modList: {
            tooltips: {
                pinned: {
                    short: string;
                    long: string;
                },
                deprecated: {
                    short: string;
                    long: string;
                },
                donate: string;
                installed: string;
                nsfw: string;
            },
            mod: {
                author: string;
            },
            actions: {
                download: string;
                website: string;
            }
        }
    },
    actions: {
        locateGameExecutable: string;
        selectExecutable: string;
        locateGameLaunchHelper: string;
        locateSteamExecutable: string;
    }
}
