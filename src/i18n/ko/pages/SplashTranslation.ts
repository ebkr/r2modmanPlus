import {SplashMessageFormat} from "../../base/pages/SplashMessageFormat";

export const SplashTranslation: SplashMessageFormat = {
    pageTitle: '{appName} 시작 중',
    gameUpdatesWarning: '게임 업데이트가 모드를 고장낼 수 있습니다. 새로운 업데이트가 출시되면 한동안 기다려 주세요.',
    menu: {
        helpLabel: '도움',
        helpItems: {
            about: '정보',
            faq: '자주 묻는 질문'
        },
    },
    actions: {
        goBack: '돌아가기',
    },
    content: {
        main: {
            didYouKnow: '알고 계셨나요?',
            externalInstallWithModManager: `
                            썬더스토어의 "Install with Mod Manager" 버튼으로
                            {appName}에서 모드를 설치할 수 있습니다.
                        `,
            goToThunderstore: '썬더스토어로 가기',
            exportProfile: `
                        설정 화면에서 선택한 프로필을 파일 또는 코드로 내보낼 수 있습니다.
                        이를 통해 친구들과 모드 목록을 쉽게 공유할 수 있습니다!
                        `,
            havingTrouble: {
                title: '문제를 겪고 계신가요?',
                body: '{appName}의 공식 디스코드의 support 채널에서 오류에 대한 스크린샷을 전송해보세요.',
                serverLinkText: '{appName}의 디스코드에 가입하세요.',
            },
        },
        about: {
            title: '{appName}에 대하여',
            creator: '제작자: Ebkr',
            techStack: {
                builtUsing: '이 앱은 다음 도구를 지원하는 Quasar로 제작되었습니다:',
                electron: 'Electron',
                node: 'NodeJS',
                vue: 'Vue 3',
                typescript: 'TypeScript',
            }
        },
        faq: {
            title: '자주 묻는 질문',
            howToGetStarted: {
                title: '어떻게 시작해야 하나요?',
                body: '온라인 탭으로 들어가서 원하시는 모드를 받고 "모드로 시작"을 눌러서 즐기세요.'
            },
            startingWithMods: {
                title: '모드로 게임 시작하기',
                body: `
                            매니저에서 게임을 시작시켜야 합니다.
                            스팀에서 시작하면 별도의 작업 없이는 모드가 적용되지 않습니다.
                            `
            }
        }
    },
    states: {
        preparing: '준비 중',
        checkingForUpdates: '업데이트 확인 중',
        checkingForLocalCache: '로컬 캐시에서 모드 목록 확인 중',
        checkingForThunderstoreUpdates: '썬더스토어에서 모드 목록 업데이트 확인 중',
        loadingLatestThunderstoreList: '썬더스토어에서 최신 모드 목록 로딩 중',
        pruningLocalCache: '제거된 모드 정리 중',
        processingModList: '모드 목록 처리 중',
    }
}
