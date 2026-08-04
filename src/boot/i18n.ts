import { defineBoot } from '#q-app/wrappers';
import { i18n } from '../i18n/instance';

// @ts-ignore
export default defineBoot(async ({ app }) => {
    // Tell app to use the I18n instance
    app.use(i18n)
});

export { i18n }
