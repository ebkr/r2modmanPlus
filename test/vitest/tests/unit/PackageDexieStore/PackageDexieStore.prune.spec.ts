import { describe, test, expect } from 'vitest';
import { selectPackageIdsToPrune } from '../../../../../src/r2mm/manager/PackageDexieStore';

const COMMUNITY = 'riskofrain2';

function keys(...fullNames: string[]): [string, string][] {
    return fullNames.map((fullName) => [COMMUNITY, fullName]);
}

describe('PackageDexieStore.selectPackageIdsToPrune', () => {
    test('Steady state deletes nothing when all stored names were fetched', () => {
        const stored = keys('author-mod', 'author-other');
        const fetched = new Set(['author-mod', 'author-other']);
        expect(selectPackageIdsToPrune(stored, fetched)).toEqual([]);
    });

    test('Removed mods deletes exactly the stored keys absent from the fetched set', () => {
        const stored = keys('author-mod', 'author-removed');
        const fetched = new Set(['author-mod']);
        expect(selectPackageIdsToPrune(stored, fetched)).toEqual(keys('author-removed'));
    });

    test('Newly added mod is an insert, never selected for deletion', () => {
        const stored = keys('author-mod');
        const fetched = new Set(['author-mod', 'author-new']);
        expect(selectPackageIdsToPrune(stored, fetched)).toEqual([]);
    });

    test('Empty fetched set deletes all stored keys', () => {
        const stored = keys('author-mod', 'author-other');
        expect(selectPackageIdsToPrune(stored, new Set())).toEqual(stored);
    });

    test('Empty store deletes nothing', () => {
        const fetched = new Set(['author-mod']);
        expect(selectPackageIdsToPrune([], fetched)).toEqual([]);
    });
});
