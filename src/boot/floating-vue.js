import FloatingVue, { VTooltip } from 'floating-vue';
import 'floating-vue/dist/style.css';
import { defineBoot } from '#q-app/wrappers'

export default defineBoot(async ({ app }) => {
    app.use(FloatingVue);
})
