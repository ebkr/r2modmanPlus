import { LinuxSetupMessageFormat } from '../../base/pages/LinuxSetupMessageFormat';

export const LinuxSetupTranslation: LinuxSetupMessageFormat = {
    hero: {
        title: 'Primii pași pentru {platformName}',
        subtitle: 'Hai să configurăm jocul corect'
    },
    flatpakWarning: {
        existingArguments: 'Se pare că ai setat la un moment dat niște parametri de lansare.',
        notice: 'Versiunea Flatpak a {appName} acum folosește un alt script wrapper.',
        mustUpdate: 'Trebuie să actualizezi parametrii tăi de lansare pentru a sprijini asta.'
    },
    instructions: {
        intro: 'Pentru a putea lansa {gameName} pe Linux, trebuie mai întâi să setezi parametrii de lansare din Steam în mod corect.',
        whyNeeded: 'Este necesar de a face asta din cauza modului în care injecția din BepInEx funcționează pe sistemele Unix.',
        copyInstruction: 'Te rugăm să copiezi și să inserezi următoarele în cadrul parametrilor de lansare pentru {gameName}:'
    },
    actions: {
        copy: 'Copie în clipboard',
        copied: 'Copiat!',
        continue: 'Continuă'
    }
};
