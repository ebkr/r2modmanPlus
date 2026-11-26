import { describe, test, expect } from 'vitest';
import { hasPackageChanged } from '../../../../../src/r2mm/manager/PackageDexieStore';

function pkg(versions: Record<string, unknown>[], overrides: Record<string, unknown> = {}): any {
    return {
        full_name: 'author-mod',
        is_deprecated: false,
        versions,
        community: 'riskofrain2',
        ...overrides,
    };
}

const stored = pkg([{version_number: '1.0.0', is_active: true, downloads: 10}]);

describe('PackageDexieStore.hasPackageChanged', () => {
    test('Package that is not in the database is written', () => {
        expect(hasPackageChanged(undefined, stored)).toBe(true);
    });

    test('Changed download counts in summary do not rewrite the package row', () => {
        const fetched = pkg([{version_number: '1.0.0', is_active: true, downloads: 999}]);
        expect(hasPackageChanged(stored, fetched)).toBe(false);
    });

    test('New version is written', () => {
        const fetched = pkg([
            {version_number: '1.1.0', is_active: true, downloads: 0},
            {version_number: '1.0.0', is_active: true, downloads: 10},
        ]);
        expect(hasPackageChanged(stored, fetched)).toBe(true);
    });

    test('Changed data in package field is written', () => {
        const fetched = pkg(stored.versions, {is_deprecated: true});
        expect(hasPackageChanged(stored, fetched)).toBe(true);
    });
});
