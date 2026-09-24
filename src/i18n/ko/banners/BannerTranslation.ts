import { BannerMessageFormat } from '../../base/banners/BannerMessageFormat';

export const BannerTranslation: BannerMessageFormat = {
    concerningPackage: {
        text: '설치된 모드 중 썬더스토어에서 완전히 삭제된 모드가 있습니다.',
        action: '여기를 눌러서 모드를 검토하세요.',
    },
    managerUpdate: {
        title: '{appName} 업데이트가 준비되었습니다.',
        linkText: '여기를 눌러서 배포 페이지로 이동하세요.',
    },
    modListUpdate: {
        error: '모드 목록을 새로 고치는 도중 오류가 발생했습니다.',
        viewDetails: '오류 세부 정보 보기',
        willKeepTrying: '매니저는 백그라운드에서 계속해서 모드 목록 새로 고침을 시도할 것입니다.',
        errorOccurred: '썬더스토어를 통해 모드 목록을 새로 고치는 도중 오류가 발생했습니다.',
        blockedByDownloads: '참고로, 모드 목록은 다른 모드가 다운로드 되는 동안에는 새로 고칠 수 없습니다.',
        waitForDownloads: '다운로드가 완료될 때까지 기다려 주세요.',
        retryPrompt: '썬더스토어를 통해 모드 목록을 새로 고치는 도중 오류가 발생했습니다. {retryAction} 하시겠습니까?',
        retryAction: '다시 시도',
    },
    updatableMods: {
        text: `
        {numberOfModsWithUpdates}개의 모드에 가능한 업데이트가 있습니다. |
        {numberOfModsWithUpdates}개의 모드에 가능한 업데이트가 있습니다.
        `,
        updateAction: '전부 업데이트할까요?',
    }
}
