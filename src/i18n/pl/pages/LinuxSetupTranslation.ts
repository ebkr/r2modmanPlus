import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Rozpoczęcie pracy na {platformName}',
        subtitle: 'Skonfigurujmy prawidłowo grę'
    },
    flatpakWarning: {
        existingArguments: 'Wygląda na to, że wcześniej ustawiono argumenty uruchamiania.',
        notice: 'Wersja Flatpak aplikacji {appName} korzysta teraz z innego skryptu wrappera.',
        mustUpdate: 'Musisz zaktualizować argumenty uruchamiania, aby to obsługiwały.'
    },
    instructions: {
        intro: 'Aby móc uruchomić {gameName} na Linuksie, musisz najpierw prawidłowo skonfigurować opcje uruchamiania Steam.',
        whyNeeded: 'Jest to konieczne ze względu na sposób działania wstrzykiwania BepInEx w systemach Unix.',
        copyInstruction: 'Skopiuj i wklej poniższy tekst do opcji uruchamiania {gameName}:'
    },
    actions: {
        copy: 'Kopiuj do schowka',
        copied: 'Skopiowano!',
        continue: 'Kontynuuj'
    }
};
