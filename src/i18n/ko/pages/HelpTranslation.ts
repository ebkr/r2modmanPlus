import { HelpMessageFormat } from '../../base/pages/HelpMessageFormat';

export const HelpTranslation: HelpMessageFormat = {
    hero: {
        title: '도움말',
        subtitle: '흔한 문제와 해결책'
    },
    tabs: {
        general: '일반',
        gameWontStart: '게임 시작이 안 됩니다',
        modsNotShowing: '모드가 안 나타나요',
        updating: '업데이트',
    },
    general: {
        gettingStarted: {
            title: '모드를 다운로드하는 법',
            whereToFindMods: `
            "{''}@:translations.pages.manager.navigation.modsActions.online{''}" 탭으로 가셔서, 모드를 찾고, 다운로드하세요.
            시간을 절약하기 위해 종속성도 같이 다운로드될 겁니다.
            `,
            onceInstalled: '사용하고 싶은 모드를 다운로드했다면, 좌측 상단에 {startModdedAction}을 누르세요.',
        },
        slowGame: {
            title: '모드를 쓰면 느려짐 / 버벅거림?',
            likelyCause: `
            몇몇 모드가 오류를 출력하고 있을 수 있습니다.
            해결책 중 하나는 모드 중 절반을 끄고 그 현상이 사라졌는지 확인하는 겁니다.
            `,
            issuePersisting: `
            만약 여전히 이상하다면 절반의 절반을 끄고 다시 해보세요.
            문제가 해결될 때까지 계속하세요.
            `,
            ifStutters: '일부 버벅거림은 최적화 모드를 통해서 해결될 수도 있습니다.',
        },
        dedicatedServers: {
            title: '전용 서버',
            content: `
            전용 서버는 매니저를 통해 직접 지원되지는 않지만, 프로필 폴더의 내용을
            전용 서버 폴더로 복사하는 방식으로 해결할 수 있습니다.
            `,
        },
        launchingExternally: {
            title: '모드 매니저 외부에서 게임을 실행하는 법',
            howTo: '스팀을 통해 게임을 직접 실행하면 기본적으로 모드가 적용되지 않은 상태로 실행됩니다.',
            whereToPlace: '사용 중인 플랫폼의 시작 옵션에서 관련 실행 인수를 입력해야 합니다.',
            forSteam: '스팀에서는, 게임 속성에서 해당 설정을 찾을 수 있습니다.',
            yourCurrentArgument: '현재 사용 중인 인수:',
            loaderNotInstalled: '모드 로더를 설치하면 이 실행 인수를 사용할 수 있습니다.',
            copyArguments: '실행 인수 복사',
        },
    },
    gameWontStart: {
        errorModal: {
            title: '게임을 시작하려 하면 빨간 경고가 뜹니다',
            solution: '주로 경고 박스 하단에 제안 사항이 표시됩니다. 그 안내가 문제를 해결할 수도 있습니다.',
        },
        redirectedToStorePage: {
            title: '스팀 상점 페이지로 이동됩니다',
            solution: '{appName}을 사용하려면 반드시 정품 게임을 소유하고 있어야 합니다. 상점 페이지에서 구매할 수 있습니다.',
        },
        consoleCloses: {
            title: '텍스트 창이 나타났다가 바로 닫힙니다',
            tryRunning: '설정에서 "{gameName} 설치 초기화"를 시도해 보세요', // TODO - Reference translation via Settings screen
            ifPersists: '문제가 계속되면 스팀을 완전히 종료한 후에 모드로 실행해 보세요.',
        }
    },
    modsNotShowing: {
        potentialSolutions: {
            title: '가능한 해결책들',
            instructToWiki: '대부분의 문제는 다음 위키에 안내된 지침을 따라하면 해결할 수 있습니다.',
            goToWiki: '위키로 가기',
        }
    },
    updating: {
        autoUpdates: {
            title: '자동 업데이트',
            whenDoesItUpdate: '매니저는 업데이트가 가능한 경우, 앱을 닫았을 때 자동으로 진행합니다.',
            downloadedInBackground: '업데이트는 백그라운드에서 다운로드됩니다.',
            promptToRunOldInstaller: '"{oldInstaller}"을(를) 관리자 권한으로 실행하라는 메시지가 표시될 수 있습니다. 이 파일이 업데이트 파일입니다.',
            ifProblemOccurs: '업데이트 도중 문제가 발생할 경우, 최신 설치 프로그렘을 다운로드해서 실행해보세요.',
        },
        ignoreUpdates: {
            title: '업데이트를 원하지 않습니다',
            content: '깃허브(GitHub)에는 자동 업데이트 기능이 없는 포터블(Portable) 버전이 있습니다. 하지만 업데이트가 있다는 알림은 표시됩니다.'
        }
    }
}
