import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '../i18n';
import Quasar from 'quasar';

Vue.use(VueI18n);

const i18n = new VueI18n({
    // Detecting Locale
    locale: Quasar.lang.getLocale(),
    fallbackLocale: 'en-us',
    messages
});

export default ({ app }: any) => {
    // Set i18n instance on app
    app.i18n = i18n;
};

export { i18n };
