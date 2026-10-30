import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: '開始在 {platformName} 上游玩',
        subtitle: '讓我們正確設定遊戲'
    },
    flatpakWarning: {
        existingArguments: '偵測到您之前已經設定過啟動參數。',
        notice: '{appName} 的 Flatpak 版本現已改用不同的封裝指令碼。',
        mustUpdate: '您必須更新啟動參數以配合此變更。'
    },
    instructions: {
        intro: '要在 Linux 上啟動 {gameName}，您必須先正確設定 Steam 啟動選項。',
        whyNeeded: '這是因為 BepInEx 在 Unix 系統上的注入方式所致。',
        copyInstruction: '請將以下內容複製貼上到 {gameName} 的啟動選項中：'
    },
    actions: {
        copy: '複製到剪貼簿',
        copied: '已複製！',
        continue: '繼續'
    }
};
