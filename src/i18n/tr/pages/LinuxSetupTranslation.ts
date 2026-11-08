import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: '{platformName} üzerinde başlarken',
        subtitle: 'Oyunu doğru şekilde yapılandıralım'
    },
    flatpakWarning: {
        existingArguments: 'Görünüşe göre daha önce başlatma parametreleri ayarlamışsınız.',
        notice: '{appName} uygulamasının Flatpak sürümü artık farklı bir sarmalayıcı betik kullanıyor.',
        mustUpdate: 'Bunu desteklemek için başlatma parametrelerinizi güncellemeniz gerekiyor.'
    },
    instructions: {
        intro: '{gameName} oyununu Linux\'ta başlatabilmek için önce Steam başlatma seçeneklerinizi doğru şekilde ayarlamanız gerekir.',
        whyNeeded: 'Bu, BepInEx enjeksiyonunun Unix sistemlerde çalışma biçimi nedeniyle gereklidir.',
        copyInstruction: 'Lütfen aşağıdakini kopyalayıp {gameName} başlatma seçeneklerine yapıştırın:'
    },
    actions: {
        copy: 'Panoya kopyala',
        copied: 'Kopyalandı!',
        continue: 'Devam et'
    }
};
