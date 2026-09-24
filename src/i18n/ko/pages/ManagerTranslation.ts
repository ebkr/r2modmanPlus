import { ManagerMessageFormat } from '../../base/pages/ManagerMessageFormat';

export const ManagerTranslation: ManagerMessageFormat = {
    navigation: {
        gameActions: {
            startModded: '모드로 시작',
            startVanilla: '바닐라로 시작'
        },
        modsActions: {
            label: '모드',
            installed: '설치됨',
            online: '온라인'
        },
        otherActions: {
            label: '기타',
            configEditor: '구성 편집기',
            settings: '설정',
            help: '도움',
        },
        profileSwitcher: {
            label: '프로필',
            gameIconAltText: '게임 이미지',
            close: '닫기',
        },
        activityBar: {
            exportProfile: '프로필 내보내기',
            exportToCode: '코드로 내보내기',
            exportToFile: '파일로 내보내기',
            refreshingModList: '모드 목록 새로 고치는 중: {progress}%',
        }
    },
    installed: {
        noModsInstalled: {
            title: '설치된 모드가 없는 것 같습니다',
            content: '좌측 상단에 온라인 탭을 눌러서 사용 가능한 모드들을 확인할 수 있습니다.',
        },
        searchAndSort: {
            search: {
                label: '검색',
                placeholder: '설치된 모드 검색',
            },
            sort: {
                label: '정렬',
                disabledPositions: {
                    label: '꺼진 모드',
                }
            }
        },
        localModCard: {
            labels: {
                deprecated: '사용 중단됨',
                disabled: '비활성화됨'
            },
            display: {
                byline: 'v{version} 제작자 {author}',
                installedAt: '설치된 날짜: {formattedDate}',
                releasedAt: '최초 공개일: {formattedDate}',
            },
            concerning: {
                recommendation: '이 모드를 제거하는 걸 권장드립니다.',
            },
            tooltips: {
                updateAvailable: '업데이트가 가능합니다.',
                dependencyIssue: '이 모드의 종속성에 문제가 있습니다.',
                disable: '비활성화',
                enable: '활성화',
                donate: '모드 제작자에게 후원하기',
                willNotBeUsed: '이 모드는 인게임에서 작동하지 않습니다.',
            },
            actions: {
                uninstall: '설치 제거',
                disable: '비활성화',
                enable: '활성화',
                associated: '관련된 모드',
                openWebsite: '웹사이트',
                update: '업데이트',
                downloadDependency: '종속성 다운로드',
                enableSpecific: '{dependencyName} 활성화',
                donate: '후원',
            }
        },
        expandableCard: {
            imageAltText: '모드 이미지',
            funkyModeAltText: 'Funky 모드 오버레이',
            tooltips: {
                dragToReorder: '드래그하여 순서 변경',
                expand: '확장',
                collapse: '축소',
            }
        },
    },
    online: {
        previewPanel: {
            author: '제작자 {author}',
            metadata: {
                downloads: '다운로드 횟수: {downloads}',
                likes: '좋아요: {likes}',
                lastUpdated: '마지막 업데이트 날짜: {date}',
                categories: '카테고리: {categories}',
            },
            actions: {
                download: '다운로드',
                viewOnline: '웹사이트로 가기',
                donate: '후원',
            },
            tabs: {
                readme: '필독 사항',
                changelog: '변경 사항',
                dependencies: '종속성 ({dependencyCount})',
            },
            packageInformation: '패키지 정보',
            nsfwWarning: '이 모드에는 노골적인 내용이 포함되어 있을 수 있습니다.',
            fetchingData: '데이터를 불러오는 중',
            noDependencies: '이 모드에는 종속성이 없습니다',
            unableToFetchReadme: '필독 사항을 불러올 수 없습니다',
            unableToFetchChangelog: '변경 사항을 불러올 수 없습니다',
        },
        topbar: {
            search: {
                label: '검색',
                placeholder: '모드 검색',
            },
            sort: '정렬',
            filter: '필터',
        },
        pagination: {
            changePageInfo: '아래 숫자로 페이지를 변경하세요',
            noFoundMods: '일치하는 모드가 없습니다',
            noMods: '사용 가능한 모드가 없습니다',
        },
        modList: {
            tooltips: {
                pinned: {
                    short: '고정됨',
                    long: '썬더스토어에서 고정됨'
                },
                deprecated: {
                    short: '사용 중단됨',
                    long: '이 모드는 고장났을 수 있습니다'
                },
                donate: '모드 제작자 후원하기',
                installed: '모드가 이미 설치되었습니다',
                nsfw: 'NSFW로 표시됨',
            },
            mod: {
                author: '제작자 {author}'
            },
            actions: {
                download: '다운로드',
                website: '웹사이트',
            }
        }
    },
    actions: {
        locateGameExecutable: '{gameName} 실행 파일 찾기',
        selectExecutable: '실행 파일 선택',
        locateGameLaunchHelper: 'gamelaunchhelper 실행 파일 찾기',
        locateSteamExecutable: '스팀 실행 파일 찾기',
    }
}
