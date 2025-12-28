import { DownloadMonitorMessageFormat } from '../../base/pages/DownloadMonitorMessageFormat';

export const DownloadMonitorTranslation: DownloadMonitorMessageFormat = {
    title: {
        text: 'Downloads',
        subtitle: 'Monitor progress of downloads'
    },
    state: {
        hasNothing: {
            inform: `You don't have anything downloading`,
            action: 'Click here to download something'
        },
        hasContent: {
            action: 'Clear finished',
            downloadFailed: 'Download failed',
            downloadComplete: 'Download complete'
        },
        modProgress: {
            downloading: 'Downloading: {modName}',
            extracting: 'Extracting: {modName}',
            progress: '{progress}% of {totalSize}',
            installing: 'Installing: {modName}',
            waiting: 'Waiting for download to finish',
        }
    }
}
