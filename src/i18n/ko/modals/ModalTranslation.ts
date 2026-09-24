import { ModalMessageFormat } from '../../base/modals/ModalMessageFormat';

export const ModalTranslation: ModalMessageFormat = {
    failedToSetSteamFolder: {
        title: '스팀 폴더 지정에 실패했습니다.',
        steamExecutableNotSelected: '스팀 실행 파일이 선택되지 않았습니다.',
        solution: '만약 실행 파일로 지정했는데도 오류가 발생한다면, 관리자 권한으로 실행해 주세요.'
    },
    failedToSetTheGameFolder: {
        title: '{gameName} 폴더 지정에 실패했습니다.',
        listedExecutableNames: '실행 파일은 다음 중 하나여야 합니다: "{options}".',
        executableMustBeOneOf: '선택된 실행 파일은 다음 중 하나여야 합니다:',
        solution: '실행 파일을 제대로 선택했는데도 오류가 발생한다면, 관리자 권한으로 실행해 주세요.'
    },
    clearingGameDirectory: {
        title: '{gameName} 설치 폴더를 초기화하는 중입니다',
        waitToLaunchGame: `
            스팀이 게임 파일 무결성 검사를 완료하기 전까진 게임을 실행할 수 없습니다.
            `,
        steamWillBeStarted: `
            곧 스팀이 실행되고 {gameName}의 무결성 검사를 시작할 겁니다.
            `,
        checkSteamForProgress: `
            스팀에서 진행 상황을 확인해주세요.
            스팀 창이 아직 나타나지 않았다면, 조금 더 기다려 주세요.
            `,
        confirmation: '이해했습니다'
    },
    dependencyStrings: {
        title: '관련된 종속성 목록',
        dependency: '{modName}-{versionNumber}',
        close: '닫기'
    },
    launchArguments: {
        title: '사용자 정의 실행 인수 설정',
        someProvidedByDefault: '일부 인수는 기본적으로 제공됩니다:',
        moddedLabel: '모드:',
        availableAfterInstallingLoader: '이 인수는 모드 로더가 설치된 후에 사용 가능합니다.',
        vanillaLabel: '바닐라:',
        pleaseNote: `
            이는 스팀 실행 파일을 대상으로 실행된다는 것을 유의하세요.
            사용자 지정 인수를 사용하는 것은 주의가 필요합니다.
            `,
        placeholder: '인수 입력',
        updateArguments: '실행 인수 업데이트',
    },
    categorySelector: {
        selectCategory: '카테고리 선택',
        noCategoriesSelected: '선택된 카테고리가 없습니다',
    },
    importLocalMod: {
        title: '파일을 통해 모드 가져오기',
        dialogTitle: '파일을 통해 로컬 모드 가져오기',
        actions: {
            selectFile: '파일 선택',
            importLocalMod: '로컬 모드 가져오기',
        },
        content: {
            instructToSelect: '가져올 압축 파일 또는 DLL 파일을 선택해주세요.',
            dataEntryInfo: `
            manifest 파일이 포함된 압축 파일의 경우 일부 정보가 미리 채워집니다.
            manifest 파일이 없는 경우에는 직접 입력해야 합니다.
            `,
            waitingForSelection: '파일을 기다리는 중입니다. 몇 분 정도 소요될 수 있습니다.',
            form: {
                modName: {
                    label: '모드 이름',
                    placeholder: '모드 이름을 입력하세요.',
                },
                modAuthor: {
                    label: '제작자 이름',
                    placeholder: '제작자 이름을 입력하세요.',
                },
                description: {
                    label: '설명 (선택)',
                    placeholder: '설명을 입력하세요.'
                },
                version: {
                    label: '버전',
                    majorLabel: '메이저',
                    minorLabel: '마이너',
                    patchLabel: '패치'
                }
            }
        },
        validationMessages: {
            modNameEmpty: '모드 이름은 비어 있어선 안 됩니다.',
            authorNameEmpty: '제작자 이름은 비어 있어선 안 됩니다.',
            invalidVersion: '각 버전 값은 0보다 큰 정수여야 합니다.',
            nonNumericVersion: '각 버전 값은 모두 숫자여야 합니다.',
            noProfileSelected: '프로필이 선택되지 않았습니다.'
        }
    },
    concerningPackage: {
        title: '{modName} 검토',
        notFound: '이 모드는 원래 썬더스토어에서 다운로드 되었으나 현재는 더 이상 존재하지 않습니다.',
        whyRemoved: '모드가 제작자에 의해 삭제되었거나, 규칙 위반으로 인해 제거되었거나, 관리자에 의해 검토되고 있을 수 있습니다.',
        recommendation: '기본적으로, 제거된 모드는 삭제하는 것을 권장드립니다.',
        exportWarning: '다른 사람들이 이 프로필을 가져올 때, 해당 모드는 가져올 수 없습니다.',
        actions: {
            markSafe: '버전을 안전한 것으로 표기',
            remove: '모드 제거',
            review: '모드 검토',
        }
    },
    gameRunning: {
        starting: '{gameName}이(가) 시작되고 있습니다.',
        launchingViaSteam: '{gameName}이(가) 스팀을 통해 시작되고 있습니다.',
        closeToContinue: '모딩을 계속하려면 이 창을 닫으세요.',
        takingAWhile: '시간이 좀 걸린다면, 스팀이 아직 실행 중일 수 있습니다.',
        bePatient: '잠시만 기다려 주세요.',
        close: '닫기',
    },
    error: {
        title: '오류',
        suggestion: '제안',
        close: '닫기',
    },
    disableMod: {
        title: '{modName} 비활성화',
        dependantsWarning: '다른 모드가 이 모드에 의존합니다. {disableAllAction}를 눌러서 종속된 모드들을 비활성화하세요, 그렇지 않으면 오류가 발생할 수 있습니다.',
        modsToBeDisabled: '비활성화될 모드',
        actions: {
            disableAll: '전부 비활성화',
            disableAllRecommended: '전부 비활성화 (권장)',
            disableOnly: '{modName}만 비활성화',
        }
    },
    uninstallMod: {
        title: '{modName} 제거',
        dependantsWarning: '다른 모드가 이 모드에 의존합니다. {uninstallAllAction}를 선택하여 종속된 모드들을 제거하세요, 그렇지 않으면 오류가 발생할 수 있습니다.',
        modsToBeUninstalled: '제거될 모드',
        actions: {
            uninstallAll: '전부 제거',
            uninstallAllRecommended: '전부 제거 (권장)',
            uninstallOnly: '{modName}만 제거',
        }
    },
    associatedMods: {
        title: '{modName} 종속성',
        dependencies: '이 모드가 의존하는 모드',
        dependants: '이 모드에 의존하는 모드',
        none: '이 모드에 의존하거나 이 모드가 의존하는 모드가 없습니다.',
        done: '완료',
    },
    codeExport: {
        title: '프로필 내보내기 완료',
        description: '코드가 클립보드에 복사되었습니다. 수동으로 복사할 수도 있습니다:',
        done: '완료',
        copied: '클립보드에 복사됨',
    },
    downloadProgress: {
        states: {
            downloading: '{modName} 다운로드 중',
            installing: '{modName} 설치 중',
        },
        complete: '다운로드 완료',
        close: '닫기',
        downloadProgress: '다운로드 중: {totalSize} 중 {progress}%',
        installProgress: '설치 중: {progress}%',
        extractionProgress: '추출 중: {totalSize} 중 {progress}%',
        waitingForDownload: '설치 중: 다운로드 완료 대기',
    },
    downloadModVersionSelect: {
        title: '다운로드할 {modName}의 버전을 선택하세요.',
        content: {
            recommendedDisclaimer: '모든 모드는 최신 버전을 선택하는 걸 권장드립니다.',
            outdatedModsAdvice: '오래된 버전을 사용하면 문제가 발생할 수 있습니다.',
        },
        tags: {
            select: '버전을 선택해야 합니다',
            recommended: '{version}은(는) 권장 버전입니다',
            latest: '{version}은(는) 최신 버전입니다',
            outdated: '{version}은(는) 오래된 버전입니다'
        },
        download: '종속성과 함께 설치',
    },
    updateAllInstalledMods: {
        noModsToUpdate: {
            title: '업데이트할 모드가 없습니다.',
            content: '설치된 모든 모드가 최신 상태이거나, 설치된 모드가 없습니다.',
            close: '닫기',
        },
        hasModsToUpdate: {
            title: '설치된 모든 모드 업데이트',
            content: {
                willBeUpdated: '설치된 모든 모드가 최신 버전으로 업데이트될 예정입니다.',
                missingDependenciesInstalled: '종속성 모드 또한 설치됩니다.',
                whatWillHappen: '다음 모드들이 다운로드되고 설치될 예정입니다:',
                modUpdatedTo: '{modName}은(는) 다음 버전으로 업데이트됩니다: {version}',
            },
            updateAll: '전부 업데이트',
        }
    },
    launchType: {
        title: '실행 방식 설정',
        auto: {
            NATIVE: '게임이 "Native" 방식으로 실행될 예정입니다.',
            PROTON: '게임이 "Proton" 방식으로 실행될 예정입니다.',
        },
        native: {
            unsureWrapperArgsPresent: '필요한 래퍼 인수가 설정되어 있는지 확인할 수 없습니다.',
            addArgumentsInfo: '아직 설정하지 않았다면, 스팀의 게임 속성에서 시작 속성에 다음 실행 인수를 추가해 주세요:',
        },
        actions: {
            copyLaunchArgs: '실행 인수 복사',
            update: '업데이트'
        }
    },
    modFilter: {
        title: '모드 카테고리 필터',
        languageDisclaimer: '카테고리는 썬더스토어로부터 제공되며 번역되지 않습니다.',
        selectors: {
            atLeastOneCategory: '이 카테고리를 최소 1개 이상 가진 모드만 표시',
            allCategories: '이 카테고리를 전부 가진 모드만 표시',
            noneCategories: '이 카테고리를 포함하지 않는 모드만 표시'
        },
        allowNsfw: 'NSFW(노골적일 수 있는) 모드 표시 허용',
        showDeprecated: '사용 중단된 모드 표시 허용',
        apply: '필터 적용'
    },
    sort: {
        title: '모드 정렬 변경',
        sortBehaviour: '정렬 동작',
        sortDirection: '정렬 방향',
        close: '닫기',
    },
    createProfile: {
        title: '프로필 생성',
        description: '이 프로필은 다른 프로필과 독립되어 이 프로필만의 모드를 저장합니다.',
        tagStates: {
            required: '프로필 이름을 입력해야 합니다',
            valid: '"{profileName}" 사용 가능한 프로필 이름입니다',
            error: '"{profileName}" 이미 있는 프로필 이름이거나 사용 불가능한 문자가 포함되어 있습니다'
        },
        actions: {
            create: '생성'
        }
    },
    deleteProfile: {
        title: '프로필 삭제',
        content: {
            resultingAction: '이는 프로필 안에 담긴 모든 모드, 구성 파일을 삭제하게 됩니다.',
            preventAction: '실수로 누르셨다면, 어두운 부분을 클릭하거나 우측 상단의 X 버튼을 클릭하세요.',
            confirmation: '정말로 이 프로필을 삭제하실 건가요?',
        },
        actions: {
            delete: '프로필 삭제',
        }
    },
    renameProfile: {
        title: '프로필 이름 변경',
        content: '이 프로필은 다른 프로필과 독립되어 이 프로필만의 모드를 저장합니다.',
        actions: {
            rename: '이름 변경',
        },
        tagStates: {
            required: '프로필 이름을 입력해야 합니다',
            valid: '"{profileName}" 사용 가능한 프로필 이름입니다',
            error: '"{profileName}" 이미 있는 프로필 이름이거나 사용 불가능한 문자가 포함되어 있습니다'
        },
    },
    importProfile: {
        dialogTitle: '프로필 가져오기',
        dialogButton: '가져오기',
        states: {
            fileCodeSelection: {
                title: '프로필을 어떻게 가져올까요?',
                actions: {
                    fromFile: '파일로',
                    fromCode: '코드로'
                }
            },
            fromFile: {
                title: '파일 불러오기',
                content: '파일 선택 창이 나타납니다. 프로필을 선택하면 몇 초 정도 걸릴 수 있습니다.',
            },
            importCode: {
                title: '프로필 코드 입력',
                enterCodePlaceholder: '프로필 코드를 입력하세요',
                tagStates: {
                    invalid: '유효하지 않은 코드입니다. 오타가 있는지 확인해주세요.',
                },
                actions: {
                    loading: '로딩 중',
                    proceed: '계속'
                }
            },
            refresh: {
                title: '온라인 모드 목록을 새로 고치는 중',
                content: {
                    description: `
                    프로필에 담긴 일부 패키지를 식별할 수 없습니다.
                    온라인 모드 목록을 새로 고치면 이를 해결할 수도 있습니다. 잠시만 기다려 주세요.
                    `,
                    waitingForModDownloads: '온라인 모드 목록을 새로 고치기 전에 다운로드가 완료될 때까지 기다리고 있습니다.',
                }
            },
            reviewImport: {
                title: '설치될 패키지',
                content: {
                    notFoundDisclaimer: '다음 패키지는 썬더스토어에서 발견되지 않았으며 설치되지 않을 것입니다:',
                    ensureCorrectProfile: '이 프로필이 정말 이 게임에서 사용되는 프로필인지 확인해 주세요.',
                    packagesWillBeInstalled: '다음 패키지가 설치될 예정입니다:',
                },
                actions: {
                    acknowledgement: '일부 모드가 가져와지지 않을 수 있다는 걸 이해했습니다.',
                    proceed: '가져오기'
                }
            },
            willImportOrUpdate: {
                title: '기존 프로필에 덮어쓸까요, 아니면 새 프로필을 만들어서 가져올까요?',
                actions: {
                    newProfile: '새 프로필 생성 후 가져오기',
                    existingProfile: '기존 프로필에 덮어쓰기',
                }
            },
            addProfile: {
                title: '프로필 가져오기',
                content: {
                    create: {
                        description: '이 프로필은 다른 프로필과 독립되어 이 프로필만의 모드를 저장합니다.'
                    },
                    update: {
                        contentsWillBeOverwritten: '선택된 프로필의 모드와 내용이 불러올 프로필로 덮어씌워질 예정입니다.',
                        selectProfile: '덮어쓸 프로필 선택:'
                    }
                },
                tagStates: {
                    required: '프로필 이름을 입력해야 합니다.',
                    valid: '"{profileName}"은(는) 유효한 프로필 이름입니다.',
                    error: '"{profileName}"은(는) 이미 사용 중이거나 유효하지 않은 문자를 포함하고 있습니다.'
                },
                actions: {
                    create: '생성',
                    update: '프로필 덮어쓰기: {profileName}'
                }
            },
            importInProgress: {
                title: {
                    downloadingMods: '모드 다운로드 중: {progress}%',
                    downloadingModsWithGoal: `모드 다운로드 중: {totalSize} 중 {progress}%`,
                    cleaningUp: '정리 중',
                    applyChanges: '프로필에 변경 사항 적용 중',
                    copyingModsToProfile: '프로필에 모드 복사 중: {progress}%',
                    copyingConfigsToProfile: '프로필에 설정 복사 중: {progress}%'

                },
                content: {
                    waitMessage: '파일이 다운로드, 추출, 복사되는데 시간이 걸릴 수 있습니다.',
                    doNotClose: '{appName}을 닫지 말아 주세요.'
                }
            }
        }
    },
    platform: {
        header: "게임을 관리하는 스토어가 무엇인가요?",
        selectAction: "플랫폼을 선택하세요",
    },
    settingsLoader: {
        managerProblem: '모드 매니저 자체에 문제가 발생했습니다. 만약 더 최신 버전이 있다면 업데이트를 시도해 보시기 바랍니다.',
        loadFailed: '로컬에 저장된 사용자 설정을 불러오지 못했습니다. 아래의 버튼을 사용하여 설정을 초기화할 수 있지만, 모든 게임의 설정이 손실되며 이 작업은 취소할 수 없습니다.',
        resetAction: '설정 초기화',
        resetFailed: '설정 초기화에 실패했습니다. 다음 안내를 따라 설정 초기화를 계속 시도하실 수 있습니다: {instructionsLink}.',
        instructionsLinkText: '안내',
        resetDidNotHelp: '로컬에 저장된 설정을 초기화했지만, 문제가 해결되지 않았습니다. 만약 더 최신 버전이 있다면 업데이트를 시도해 보시기 바랍니다.'
    },
    actions: {
        close: '닫기',
    },
}
