import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: '다운로드',
        subtitle: '다운로드 진행 상황을 확인하세요'
    },
    actions: {
        retry: '재시도',
        remove: '제거'
    },
    state: {
        hasNothing: {
            inform: `다운로드 중인 항목이 없습니다`,
            action: '뭔가를 다운로드하려면 여기를 클릭하세요'
        },
        hasContent: {
            action: '완료된 항목 지우기',
            downloadFailed: '다운로드 실패',
            downloadComplete: '다운로드 완료'
        },
        modProgress: {
            downloading: '다운로드 중: {modName}',
            extracting: '추출 중: {modName}',
            progress: '{progress}% of {totalSize}',
            installing: '설치 중: {modName}',
            waiting: '다운로드 완료 대기 중',
            installProgress: '{progress}% 완료',
        }
    }
}
