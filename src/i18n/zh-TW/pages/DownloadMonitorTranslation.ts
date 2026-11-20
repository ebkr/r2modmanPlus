import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: '下載',
        subtitle: '監控下載進度'
    },
    actions: {
        retry: '重試',
        remove: '移除'
    },
    state: {
        hasNothing: {
            inform: '目前沒有正在進行的下載',
            action: '點選此處下載模組'
        },
        hasContent: {
            action: '清除已完成',
            downloadFailed: '下載失敗',
            downloadComplete: '下載完成'
        },
        modProgress: {
            downloading: '正在下載：{modName}',
            extracting: '正在解壓縮：{modName}',
            progress: '已完成 {progress}%（共 {totalSize}）',
            installing: '正在安裝：{modName}',
            waiting: '等待下載完成',
            installProgress: '已完成 {progress}%'
        }
    }
}
