import Dexie from 'dexie';
// @ts-ignore
import indexedDB from 'fake-indexeddb';

Dexie.dependencies.indexedDB = indexedDB;

export default class DexiePrep {

    // Stub method to ensure early init of Dexie dependency.
    public static initDexie() {
        return Dexie;
    }

}
