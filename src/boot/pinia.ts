import { defineBoot } from '#q-app/wrappers';
import { createPinia } from 'pinia';

export default defineBoot(async ({ app }) => {
    const pinia = createPinia();
    app.use(pinia);
});
