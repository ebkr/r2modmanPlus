import { createI18n } from 'vue-i18n';
import messages, { datetimeFormats } from './index';

export const i18n = createI18n({
    locale: 'en',
    globalInjection: true,
    allowComposition: true,
    legacy: false,
    messages,
    datetimeFormats
});
