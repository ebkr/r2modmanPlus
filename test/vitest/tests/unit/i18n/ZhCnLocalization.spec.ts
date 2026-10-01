import { beforeAll, describe, expect, test } from 'vitest';
import { i18n } from '../../../../../src/i18n/instance';
import messages from '../../../../../src/i18n';

/**
 * Verifies the Simplified Chinese (zh-cn) language pack through the real
 * vue-i18n instance used by the application.
 *
 * These tests deliberately avoid mounting .vue components: this project's vitest
 * setup does not apply the Quasar/Vite SFC pipeline (no `~assets` alias, no
 * unplugin-vue-components), so SFC imports cannot be compiled here. Every
 * assertion below goes through the message tree itself.
 */

const ZH = 'zh-cn';

/** One representative key per translation section (15 sections in total). */
const REPRESENTATIVE_KEYS: Array<[string, string]> = [
    ['translations.platforms.OTHER', '其他'],
    ['translations.enums.sortingStyle.DOWNLOADS', '下载量'],
    ['translations.modListStatus.almostDone', '即将完成'],
    ['translations.banners.concerningPackage.text', 'Thunderstore'],
    ['translations.modals.error.title', '错误'],
    ['translations.pages.configEditor.hero.title', '模组配置编辑器'],
    ['translations.pages.downloadMonitor.title.text', '下载'],
    ['translations.pages.error404.actions.goBack', '返回'],
    ['translations.pages.gameSelection.tabs.game', '游戏'],
    ['translations.pages.help.hero.title', '帮助'],
    ['translations.pages.linuxSetup.actions.copy', '复制到剪贴板'],
    ['translations.pages.manager.navigation.modsActions.label', '模组'],
    ['translations.pages.profileSelection.actions.select', '选择'],
    ['translations.pages.settings.entries.theme.title', '主题'],
    ['translations.pages.splash.content.faq.title', '常见问题'],
];

/**
 * Flattens a message tree into its leaf paths, so a key that is missing, renamed
 * or duplicated is reported as a concrete path instead of a dump of both trees.
 */
function leafPaths(value: unknown, prefix = ''): string[] {
    if (Array.isArray(value)) {
        return [prefix];
    }
    if (value !== null && typeof value === 'object') {
        return Object.entries(value as Record<string, unknown>)
            .flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key))
            .sort();
    }
    return [prefix];
}

describe('Simplified Chinese language pack', () => {
    beforeAll(() => {
        i18n.global.locale.value = ZH;
    });

    test('is registered, selectable and self-describing', () => {
        expect(i18n.global.availableLocales).toContain(ZH);
        expect(messages[ZH].metadata.name).toBe('简体中文');
        expect(messages[ZH].metadata.locale).toBe('zh-CN');
    });

    test('declares a locale that Intl can use', () => {
        const locale = messages[ZH].metadata.locale;
        expect(() => new Intl.DateTimeFormat(locale)).not.toThrow();
        // A zh-CN formatter must not fall back to English month names.
        const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, 7, 1));
        expect(month).toMatch(/[\u3400-\u9FFF]/);
    });

    test('the active locale really is zh-cn', () => {
        expect(i18n.global.locale.value).toBe(ZH);
    });

    test.each(REPRESENTATIVE_KEYS)('%s resolves to Chinese', (key, expected) => {
        const value = i18n.global.t(key);
        expect(typeof value).toBe('string');
        expect(value).not.toBe(key); // an unresolved key would echo itself back
        expect(value).toContain(expected);
        expect(value).toMatch(/[\u3400-\u9FFF]/);
    });

    test('every translation section resolves without falling back to English', () => {
        const englishValues = new Set<string>();
        i18n.global.locale.value = 'en';
        for (const [key] of REPRESENTATIVE_KEYS) {
            englishValues.add(i18n.global.t(key));
        }
        i18n.global.locale.value = ZH;

        for (const [key] of REPRESENTATIVE_KEYS) {
            const chinese = i18n.global.t(key);
            expect(englishValues.has(chinese), `${key} still renders the English string`).toBe(false);
        }
    });

    test('interpolation placeholders are preserved', () => {
        expect(i18n.global.t('translations.banners.managerUpdate.title', { appName: 'r2modman' }))
            .toBe('有可用的 r2modman 更新。');

        expect(i18n.global.t('translations.modals.gameRunning.starting', { gameName: 'Valheim' }))
            .toContain('Valheim');

        expect(i18n.global.t('translations.pages.settings.entries.resetGameInstallation.title', { gameName: 'Valheim' }))
            .toBe('重置 Valheim 安装');
    });

    test('plural messages select the branch matching the plural argument', () => {
        const key = 'translations.pages.settings.entries.modState.someDisabled';

        // vue-i18n picks the branch from the explicit plural argument and
        // interpolates {count} from the named one.
        const singular = i18n.global.t(key, { count: 1 }, 1);
        const plural = i18n.global.t(key, { count: 5 }, 5);

        expect(singular).toBe('有 1 个模组已停用。');
        expect(plural).toBe('有 5 个模组已停用。');
    });

    test('zh-cn mirrors the English message tree path for path', () => {
        // The MessageFormat contract catches a missing key at compile time. This
        // catches what the compiler cannot see: a key renamed, dropped or added
        // inside a nested object, which would silently fall back to English.
        expect(leafPaths(messages[ZH].translations)).toEqual(leafPaths(messages.en.translations));
    });

    test('linked messages resolve to another Chinese message', () => {
        const resolved = i18n.global.t('translations.pages.help.general.gettingStarted.whereToFindMods');
        expect(resolved).toContain('在线');
        expect(resolved).not.toContain('@:');
    });

    test('switching locale back and forth keeps Chinese intact', () => {
        i18n.global.locale.value = 'en';
        expect(i18n.global.t('translations.modals.error.title')).toBe('Error');
        i18n.global.locale.value = ZH;
        expect(i18n.global.t('translations.modals.error.title')).toBe('错误');
    });

    test('every shipped locale declares a display name and a usable Intl tag', () => {
        const catalogues = messages as Record<string, { metadata: { name: string; locale: string } }>;
        for (const [key, catalogue] of Object.entries(catalogues)) {
            expect(catalogue.metadata.name, `${key} has no display name`).not.toBe('');
            expect(() => new Intl.DateTimeFormat(catalogue.metadata.locale), key).not.toThrow();
        }
    });
});
