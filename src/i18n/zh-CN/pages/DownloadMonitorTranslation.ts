import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: '下载',
        subtitle: '监控下载进度'
    },
    actions: {
        retry: '重试',
        remove: '移除'
    },
    state: {
        hasNothing: {
            inform: '当前没有正在进行的下载',
            action: '点击此处下载模组'
        },
        hasContent: {
            action: '清除已完成',
            downloadFailed: '下载失败',
            downloadComplete: '下载完成'
        },
        modProgress: {
            downloading: '正在下载：{modName}',
            extracting: '正在解压：{modName}',
            progress: '已完成 {progress}%（共 {totalSize}）',
            installing: '正在安装：{modName}',
            waiting: '等待下载完成',
            installProgress: '已完成 {progress}%'
        }
    }
}
