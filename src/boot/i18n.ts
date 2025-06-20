import { createI18n } from 'vue-i18n';
import messages from '../i18n';
// You'll need to create the src/i18n/index.js/.ts file too

const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
    messages
})

// @ts-ignore
export default ({ app }) => {
    // Tell app to use the I18n instance
    app.use(i18n)
}

export { i18n }
