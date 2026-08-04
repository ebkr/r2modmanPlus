export type DownloadMonitorMessageFormat = {
    title: {
        text: string;
        subtitle: string;
    },
    actions: {
        retry: string;
        remove: string;
    },
    state: {
        hasNothing: {
            inform: string;
            action: string;
        },
        hasContent: {
            action: string;
            downloadFailed: string;
            downloadComplete: string;
        },
        modProgress: {
            downloading: string;
            extracting: string;
            progress: string;
            installing: string;
            waiting: string;
            installProgress: string;
        }
    }
}
