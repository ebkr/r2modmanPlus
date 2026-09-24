import {SettingsMessageFormat} from "../../base/pages/SettingsMessageFormat";

export const SettingsTranslation: SettingsMessageFormat = {
    hero: {
        title: '설정',
        subtitle: '{appName}: {version}의 상세 설정',
    },
    nav: {
        label: '섹션',
        categories: {
            all: '전체',
            directories: '디렉토리',
            profile: '프로필',
            appearance: '디자인',
            debugging: '디버깅',
            modpacks: '모드팩',
            other: '기타',
        }
    },
    search: {
        label: '검색',
        placeholder: '설정 검색',
    },
    actions: {
        change: '변경',
        browse: '탐색',
        notSet: '설정 안함',
    },
    entries: {
        changeLaunchBehaviour: {
            title: '실행 동작 변경',
            description: '특정 실행 동작을 선택합니다. 게임이 Native 또는 Proton을 사용하도록 매니저에 지정할 수 있습니다.',
            current: '현재 실행 동작은 다음과 같습니다:',
            searchTerms: [
                '실행 동작 변경',
                '실행 모드 설정',
                'Proton',
                'Native',
                '자동',
            ],
        },
        cleanOnlineModListCache: {
            title: '온라인 모드 목록 캐시 삭제',
            description: '로컬에 저장된 모드 목록 사본을 삭제하고 새로 받습니다.',
            action: '온라인 모드 목록 정리',
            searchTerms: [
                '모드 목록 캐시 정리',
                '초기화',
            ],
        },
        copyLogToClipboard: {
            title: '로그를 클립보드에 복사',
            description: '로그 파일의 내용을 디스코드에 공유하기 적합한 형식으로 클립보드에 복사합니다.',
            searchTerms: [
                '로그를 클립보드에 복사',
                'LogOutput',
                'LogOutput.txt',
                '디스코드',
            ],
        },
        copyTroubleshooting: {
            title: '문제 해결 정보를 클립보드에 복사',
            description: '설정 및 기타 정보를 디스코드에 공유하기 적합한 형식으로 클립보드에 복사합니다. 지원을 요청할 때 이 정보를 공유하세요.',
            searchTerms: [
                '문제 해결 정보를 클립보드에 복사',
                '디스코드',
                '지원',
                '시스템',
            ],
        },
        dataDirectory: {
            title: '데이터, 프로필 폴더',
            description: '모든 프로필과 모드가 저장될 폴더를 지정합니다.',
            warning: '데이터 폴더를 옮겨도 현재 프로필이 이동하거나 사라지지 않습니다. 이전 프로필은 여전히 이전 폴더에 남습니다.',
            dataFolder: '데이터 폴더',
            profileFolder: '프로필 폴더',
            dialog: {
                title: '{appName} 데이터를 저장할 새로운 폴더를 지정하세요',
                button: '데이터 폴더 지정',
            },
            searchTerms: [
                '데이터, 프로필 저장공간',
                '변경',
                '탐색',
                '폴더',
                '디렉터리',
            ],
        },
        downloadCache: {
            title: '다운로드 캐시',
            description: '켜놓으면, 이미 모드의 복사본이 캐시에 있는 경우, 다운로드를 건너뜁니다.',
            enabled: '활성화 (권장)',
            disabled: '비활성화',
            searchTerms: [
                '다운로드 캐시 토글',
                '다운로드 캐시',
                '토글',
            ],
        },
        expandCards: {
            title: '기본적으로 카드 확장',
            description: '모드 목록을 열 때, 기본적으로 모든 모드의 카드를 확장합니다.',
            expanded: '확장',
            collapsed: '축소',
            searchTerms: [
                '기본적으로 카드 확장',
                '토글',
                '축소',
                '확장',
            ],
        },
        exportProfile: {
            title: '프로필 내보내기',
            description: '모드 목록과 설정을 내보내 친구들과 공유하고, 동일한 프로필을 빠르고 쉽게 만들 수 있습니다.',
            asFile: '파일로',
            asCode: '코드로',
            dialog: {
                title: '프로필을 내보낼 폴더를 선택하세요',
                button: '내보낼 폴더 선택',
            },
            searchTerms: [
                '프로필 내보내기',
                '파일로',
                '코드로',
            ],
        },
        funkyMode: {
            title: 'funky 모드 켜기',
            description: 'funky 모드입니다.',
            enabled: '활성화',
            disabled: '비활성화',
            searchTerms: [
                'funky 모드 켜기',
                '토글',
                '비활성화'
            ],
        },
        gameDirectory: {
            title: '{gameName} 폴더',
            description: '게임 디렉터리는 적절한 파일을 정확하게 배치하기 위해 필요합니다.',
            warning: '이 경로가 제대로 지정되어 있지 않다면 {gameName} 는 모드가 적용되지 않은 상태로 실행될 것입니다.',
            unsure: '어디로 지정해야 하는지 모르겠어요',
            searchTerms: [
                '{gameName} 폴더',
                '변경',
                '탐색',
                '게임',
                '디렉터리',
                '디렉터리',
            ],
        },
        importLocalMod: {
            title: '로컬 모드 가져오기',
            description: '오프라인 상태에서 당신의 파일로 모드를 설치합니다. 모든 모드가 로컬 데이터로 설치될 수는 없습니다.',
            searchTerms: [
                '로컬 모드 가져오기',
                '오프라인으로 설치',
                '가져오기',
            ],
        },
        launchArguments: {
            title: '실행 인수',
            description: '게임을 시작할 때 추가할 사용자 지정 실행 인수를 입력합니다.',
            action: '실행 인수 설정',
            searchTerms: [
                '실행 인수 설정',
                '실행 인수',
            ],
        },
        modCache: {
            title: '모드 캐시',
            description: '다운로드된 모드는 캐시에 저장되고 다시 다운로드하지 않아도 됩니다.',
            stillWritten: '비활성화해도 모드는 캐시에 계속 저장되므로 디스크 공간을 계속 사용합니다.',
            action: '캐시 정리',
            actionDescription: '프로필에서 사용하지 않는 캐시된 모드를 삭제하여 저장 공간을 확보합니다.',
            enabled: '활성화',
            disabled: '비활성화',
            enabledHint: '캐시에 있는 다운로드 재사용(권장)',
            disabledHint: '다운로드 캐시 무시, 매번 다시 다운로드하기',
            searchTerms: [
                '모드 캐시',
                '다운로드',
                '캐시 다운로드 재사용',
                '토글',
                '모드 캐시 정리',
                '공간 확보',
                '정리',
                '저장공간',
            ],
        },
        modState: {
            title: '모드 상태 변경',
            description: '프로필에 있는 모든 모드들을 활성화 / 비활성화 합니다.',
            enableAll: '모든 모드 활성화',
            disableAll: '모든 모드 비활성화',
            allEnabled: '당신의 모든 모드는 현재 활성화된 상태입니다.',
            allDisabled: '당신의 모든 모드는 현재 비활성화된 상태입니다.',
            someDisabled: '현재 1개의 모드가 비활성화된 상태입니다. | 현재 {count}개의 모드가 비활성화된 상태입니다.',
            searchTerms: [
                '모드 상태 변경',
                '토글',
                '모든 모드 활성화',
                '모든 모드 비활성화',
            ],
        },
        onlineModList: {
            title: '온라인 모드 목록',
            description: '새로운 모드의 출시 확인 혹은 로컬 사본을 정리합니다.',
            refresh: '새로고침',
            deleteCopy: '사본 제거',
            states: {
                refreshing: '새로고치는 중...',
                error: '새로고치기 실패: {message}',
                disabledWhileDownloading: '진행 중인 다운로드가 있을 경우 새로고침이 비활성화 됩니다.',
                lastUpdated: '최근 새로고친 시기: {date}',
                noApiInfo: '가능한 API 정보가 없음',
            },
            searchTerms: [
                '온라인 모드 목록 새로고침',
                '새로운 모드 출시 확인',
                '온라인 모드 목록 캐시 정리',
                '모드 목록 캐시 정리',
            ],
        },
        refreshOnlineModList: {
            title: '온라인 모드 목록 새로고침',
            description: '새로운 모드 출시 여부를 확인합니다 {status}',
            action: '새로고침',
            states: {
                refreshing: '새로고치는 중...',
                error: '새로고치기 실패: {message}',
                disabledWhileDownloading: '진행 중인 다운로드가 있을 경우 새로고침이 비활성화 됩니다.',
                cacheDate: '캐시 데이터: {date}',
                noApiInfo: '가능한 API 정보가 없음',
            },
            searchTerms: [
                '온라인 모드 목록 새로고침',
                '새로운 모드 출시 확인',
                '썬더스토어 모드',
            ],
        },
        resetGameInstallation: {
            title: '{gameName} 설치 초기화',
            description: '손상된 파일이나 수동 모딩으로 인해 남은 파일로 발생한 문제를 해결합니다. {folderName} 폴더의 모든 내용을 삭제한 후 스팀을 통해 파일을 검증합니다.',
            action: '설치 초기화',
            searchTerms: [
                '{gameName} 설치 초기화',
                '유효성 검사',
                '무결성 검사',
                '손상',
                '파일',
            ],
        },
        showDependencyStrings: {
            title: '종속성 목록 보기',
            description: '설치된 모드와 버전 목록을 봅니다. {modCount}개의 모드에 대해 manifest.json의 종속성 배열에서 사용되는 종속성 문자열을 표시합니다.',
            searchTerms: [
                '종속성 목록 보기',
            ],
        },
        steamDirectory: {
            title: '스팀 폴더',
            description: '스팀 실행기가 있는 스팀 폴더',
            value: '이를 통해 {appName}가 게임을 실행합니다.',
            searchTerms: [
                '스팀 폴더 변경',
                '스팀 디렉터리 변경',
                '탐색',
                '디렉터리',
            ],
        },
        theme: {
            title: '테마',
            description: '매니저 테마를 라이트, 다크 중에 설정하세요.',
            light: '라이트',
            dark: '다크',
            searchTerms: [
                '테마',
                '라이트',
                '다크',
                '디자인',
            ],
        },
        toggleCdn: {
            title: '선호하는 썬더스토어 CDN 전환',
            description: '앱이 다시 시작될 때까지 CDN을 전환합니다. 모드 다운로드 문제를 우회하는 데 도움이 될 수 있습니다.',
            action: '선호하는 썬더스토어 CDN 전환',
            current: '현재: {label}',
            searchTerms: [
                '선호하는 썬더스토어 CDN 전환',
                '변경',
            ],
        },
        updateAllMods: {
            title: '모든 모드 업데이트',
            description: '모든 모드를 최신 버전으로 빠르게 업데이트합니다. {status}',
            status: '1개의 모드에 업데이트가 있습니다. | {count}개의 모드에 업데이트가 있습니다.',
            searchTerms: [
                '모든 모드 업데이트',
            ],
        },
    }
};
